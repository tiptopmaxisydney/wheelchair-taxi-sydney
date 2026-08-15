/**
 * Port of the wheelchair-booking plugin's premium date + time picker
 * (wcb-datetime.js on the live site). `type="datetime-local"` renders in the
 * browser's locale format and can't be restyled, so each `[data-wcb-datetime]`
 * hidden input is progressively enhanced into a text input plus a calendar
 * popup. The visible input shows dd-mm-yyyy HH:mm; the hidden input carries
 * the same string under its original field name (dd-mm-yyyy HH:mm, 24-hour)
 * so the REST payload matches the live site exactly.
 */

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const MINUTE_STEP = 5;
const YEARS_AHEAD = 2;

const CAL_ICON =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 11h18"/></svg>';
const CLOCK_ICON =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>';

function pad(value: number): string {
  return value < 10 ? "0" + value : "" + value;
}

function formatDate(date: Date): string {
  return pad(date.getDate()) + "-" + pad(date.getMonth() + 1) + "-" + date.getFullYear();
}

/** 24-hour twelve o'clock is 12 AM, not 0 AM. */
function to12Hour(hour: number): number {
  return hour % 12 === 0 ? 12 : hour % 12;
}

function meridiemOf(hour: number): string {
  return hour < 12 ? "AM" : "PM";
}

/** What the customer reads: dd-mm-yyyy hh:mm AM. */
export function formatValue(date: Date): string {
  return (
    formatDate(date) + " " + pad(to12Hour(date.getHours())) + ":" + pad(date.getMinutes()) + " " + meridiemOf(date.getHours())
  );
}

/**
 * What is stored and sent: dd-mm-yyyy HH:mm, 24-hour. Keeping the machine
 * format separate from the display keeps the REST payload unambiguous.
 */
export function machineValue(date: Date): string {
  return formatDate(date) + " " + pad(date.getHours()) + ":" + pad(date.getMinutes());
}

/**
 * Accepts dd-mm-yyyy with -, / or . separators and an optional time in
 * either notation, so a customer can type "5:40 pm" or "17:40".
 */
export function parseValue(text: string | null | undefined): Date | null {
  const match = String(text || "")
    .trim()
    .match(/^(\d{1,2})[-\/.](\d{1,2})[-\/.](\d{4})(?:[\sT]+(\d{1,2}):(\d{2})\s*(?:([AaPp])\.?[Mm]\.?)?)?$/);
  if (!match) return null;

  const day = parseInt(match[1], 10);
  const month = parseInt(match[2], 10);
  const year = parseInt(match[3], 10);
  let hour = match[4] === undefined ? 9 : parseInt(match[4], 10);
  const minute = match[5] === undefined ? 0 : parseInt(match[5], 10);
  const meridiem = match[6] ? match[6].toUpperCase() : "";

  if (meridiem) {
    // 12 AM is midnight and 12 PM is noon, so 12 is the special case.
    if (hour < 1 || hour > 12) return null;
    hour = hour % 12;
    if (meridiem === "P") hour += 12;
  }

  if (month < 1 || month > 12 || day < 1 || hour > 23 || minute > 59) return null;
  const date = new Date(year, month - 1, day, hour, minute, 0, 0);
  // Rejects impossible days such as 31-02-2026, which Date would roll over.
  if (date.getDate() !== day || date.getMonth() !== month - 1 || date.getFullYear() !== year) return null;
  return date;
}

export const WCBDateTime = {
  /** Same 12-hour text as the picker, without owning a second parser. */
  display(machineText: string | null | undefined): string {
    const parsed = parseValue(machineText);
    return parsed ? formatValue(parsed) : String(machineText || "");
  },
};

function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function sameDay(a: Date | null, b: Date | null): boolean {
  return !!a && !!b && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

/** Monday-first offset, matching the AU convention used in the header row. */
function leadingBlanks(year: number, month: number): number {
  return (new Date(year, month, 1).getDay() + 6) % 7;
}

type Option = { value: string; label: string };

function buildSelect(className: string, options: Option[], selected: string): string {
  let html = '<select class="' + className + '">';
  options.forEach((option) => {
    html += '<option value="' + option.value + '"' + (option.value === selected ? " selected" : "") + ">" + option.label + "</option>";
  });
  return html + "</select>";
}

/**
 * Hours and minutes use a custom listbox rather than a <select>: the native
 * dropdown draws an OS-width scrollbar that no stylesheet can slim down.
 */
function buildSpinner(className: string, options: Option[], selected: string, label: string): string {
  let html =
    '<div class="wcb-dt-spin ' + className + '">' +
    '<button type="button" class="wcb-dt-spin-btn" aria-label="' + label + '" aria-haspopup="listbox" aria-expanded="false">' +
    '<span class="wcb-dt-spin-value">' + selected + "</span>" +
    '<svg class="wcb-dt-spin-caret" viewBox="0 0 12 8" aria-hidden="true"><path d="M1 1.5 6 6.5l5-5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
    "</button>" +
    '<div class="wcb-dt-spin-list" role="listbox" aria-label="' + label + '">';
  options.forEach((option) => {
    const active = option.value === selected;
    html +=
      '<button type="button" role="option" class="wcb-dt-spin-opt' + (active ? " is-active" : "") + '" data-value="' + option.value + '" aria-selected="' + (active ? "true" : "false") + '">' +
      option.label +
      "</button>";
  });
  return html + "</div></div>";
}

type SpinnerApi = { close: () => void; value: string };

/**
 * Gives the spinner the slice of the <select> API the picker relies on — a
 * readable and writable `value` — so the surrounding code is unchanged.
 */
function bindSpinner(root: HTMLElement, onChange: () => void, closeOthers: (except: SpinnerApi) => void): SpinnerApi {
  const button = root.querySelector<HTMLButtonElement>(".wcb-dt-spin-btn")!;
  const valueEl = root.querySelector<HTMLElement>(".wcb-dt-spin-value")!;
  const list = root.querySelector<HTMLElement>(".wcb-dt-spin-list")!;
  let current = valueEl.textContent || "";

  function paint() {
    valueEl.textContent = current;
    Array.prototype.forEach.call(list.querySelectorAll(".wcb-dt-spin-opt"), (option: HTMLElement) => {
      const active = option.getAttribute("data-value") === current;
      option.classList.toggle("is-active", active);
      option.setAttribute("aria-selected", active ? "true" : "false");
    });
  }

  function close() {
    root.classList.remove("is-open");
    button.setAttribute("aria-expanded", "false");
  }

  const api: SpinnerApi = {
    close,
    get value() {
      return current;
    },
    set value(next: string) {
      current = next;
      paint();
    },
  };

  function open() {
    closeOthers(api);
    root.classList.add("is-open");
    button.setAttribute("aria-expanded", "true");
    const active = list.querySelector<HTMLElement>(".is-active");
    if (active) {
      // Centres the selection by scrolling the list only.
      list.scrollTop = active.offsetTop - (list.clientHeight - active.offsetHeight) / 2;
    }
  }

  const onButtonClick = () => {
    if (root.classList.contains("is-open")) close();
    else open();
  };
  const onListClick = (event: MouseEvent) => {
    const option = (event.target as HTMLElement).closest<HTMLElement>(".wcb-dt-spin-opt");
    if (!option) return;
    current = option.getAttribute("data-value") || "";
    paint();
    close();
    onChange();
  };

  button.addEventListener("click", onButtonClick);
  list.addEventListener("click", onListClick);

  return api;
}

type Picker = { close: () => void };

function createPicker(hiddenInput: HTMLInputElement, closeAllPickers: () => void): Picker {
  const wrapper = document.createElement("div");
  wrapper.className = "wcb-datetime";

  const displayId = hiddenInput.id + "Display";
  const minDate = startOfDay(new Date());
  let selected = parseValue(hiddenInput.value);
  let viewDate = startOfDay(selected || new Date());
  let open = false;

  // 12 first, matching how a clock face reads: 12, 01 … 11.
  const hourOptions: Option[] = [{ value: "12", label: "12" }];
  for (let h = 1; h < 12; h++) hourOptions.push({ value: pad(h), label: pad(h) });
  const meridiemOptions: Option[] = [{ value: "AM", label: "AM" }, { value: "PM", label: "PM" }];
  const minuteOptions: Option[] = [];
  for (let m = 0; m < 60; m += MINUTE_STEP) minuteOptions.push({ value: pad(m), label: pad(m) });
  const monthOptions: Option[] = MONTHS.map((name, index) => ({ value: String(index), label: name }));
  const yearOptions: Option[] = [];
  const baseYear = minDate.getFullYear();
  for (let y = baseYear; y <= baseYear + YEARS_AHEAD; y++) yearOptions.push({ value: String(y), label: String(y) });

  wrapper.innerHTML =
    '<div class="wcb-datetime-field">' +
    '<input type="text" class="wcb-datetime-input" id="' + displayId + '" placeholder="dd-mm-yyyy --:-- --" autocomplete="off" inputmode="numeric" aria-haspopup="dialog" aria-expanded="false">' +
    '<button type="button" class="wcb-datetime-toggle" aria-label="Open calendar">' + CAL_ICON + "</button>" +
    "</div>" +
    '<div class="wcb-dt-pop" role="dialog" aria-modal="false" aria-label="Choose date and time">' +
    '<div class="wcb-dt-head">' +
    '<button type="button" class="wcb-dt-nav" data-dt="prev" aria-label="Previous month">&#8249;</button>' +
    '<div class="wcb-dt-title">' +
    buildSelect("wcb-dt-month", monthOptions, String(viewDate.getMonth())) +
    buildSelect("wcb-dt-year", yearOptions, String(viewDate.getFullYear())) +
    "</div>" +
    '<button type="button" class="wcb-dt-nav" data-dt="next" aria-label="Next month">&#8250;</button>' +
    "</div>" +
    '<div class="wcb-dt-week">' + WEEKDAYS.map((day) => '<span aria-hidden="true">' + day.slice(0, 2) + "</span>").join("") + "</div>" +
    '<div class="wcb-dt-grid"></div>' +
    '<div class="wcb-dt-time">' +
    '<span class="wcb-dt-time-label">' + CLOCK_ICON + "Time</span>" +
    '<span class="wcb-dt-selects">' +
    buildSpinner("wcb-dt-hour", hourOptions, pad(to12Hour(selected ? selected.getHours() : 9)), "Hour") +
    '<span class="wcb-dt-colon">:</span>' +
    buildSpinner("wcb-dt-minute", minuteOptions, pad(selected ? selected.getMinutes() - (selected.getMinutes() % MINUTE_STEP) : 0), "Minute") +
    buildSpinner("wcb-dt-meridiem", meridiemOptions, meridiemOf(selected ? selected.getHours() : 9), "AM or PM") +
    "</span>" +
    "</div>" +
    '<div class="wcb-dt-actions">' +
    '<button type="button" class="wcb-dt-btn" data-dt="clear">Clear</button>' +
    '<button type="button" class="wcb-dt-btn is-primary" data-dt="done">Done</button>' +
    "</div>" +
    "</div>";

  hiddenInput.parentNode!.insertBefore(wrapper, hiddenInput);
  wrapper.appendChild(hiddenInput);
  hiddenInput.type = "hidden";
  hiddenInput.removeAttribute("id");

  const display = wrapper.querySelector<HTMLInputElement>(".wcb-datetime-input")!;
  const toggle = wrapper.querySelector<HTMLButtonElement>(".wcb-datetime-toggle")!;
  const pop = wrapper.querySelector<HTMLElement>(".wcb-dt-pop")!;
  const grid = wrapper.querySelector<HTMLElement>(".wcb-dt-grid")!;
  const monthSelect = wrapper.querySelector<HTMLSelectElement>(".wcb-dt-month")!;
  const yearSelect = wrapper.querySelector<HTMLSelectElement>(".wcb-dt-year")!;
  const prevButton = wrapper.querySelector<HTMLButtonElement>('[data-dt="prev"]')!;
  const nextButton = wrapper.querySelector<HTMLButtonElement>('[data-dt="next"]')!;

  function closeSpinners(except?: SpinnerApi) {
    [hourSelect, minuteSelect, meridiemSelect].forEach((spinner) => {
      if (spinner && spinner !== except) spinner.close();
    });
  }

  const hourSelect = bindSpinner(wrapper.querySelector<HTMLElement>(".wcb-dt-hour")!, applyTime, closeSpinners);
  const minuteSelect = bindSpinner(wrapper.querySelector<HTMLElement>(".wcb-dt-minute")!, applyTime, closeSpinners);
  const meridiemSelect = bindSpinner(wrapper.querySelector<HTMLElement>(".wcb-dt-meridiem")!, applyTime, closeSpinners);

  /** The three spinners read as 12-hour; the Date needs 24. */
  function chosenHour(): number {
    const hour = parseInt(hourSelect.value, 10) % 12;
    return meridiemSelect.value === "PM" ? hour + 12 : hour;
  }

  function showTime(date: Date) {
    hourSelect.value = pad(to12Hour(date.getHours()));
    minuteSelect.value = pad(date.getMinutes() - (date.getMinutes() % MINUTE_STEP));
    meridiemSelect.value = meridiemOf(date.getHours());
  }

  // Move the label onto the visible input now that the original id moved.
  const row = wrapper.closest<HTMLElement>(".wcb-form-row");
  const label = row ? row.querySelector("label") : null;
  if (label) label.setAttribute("for", displayId);

  function commit(date: Date | null) {
    display.value = date ? formatValue(date) : "";
    hiddenInput.value = date ? machineValue(date) : "";
    // Bubbles to the form, which recalculates the review summary.
    hiddenInput.dispatchEvent(new Event("change", { bubbles: true }));
  }

  function renderGrid() {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    const blanks = leadingBlanks(year, month);
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const today = startOfDay(new Date());
    let html = "";

    for (let i = 0; i < blanks; i++) html += "<span></span>";
    for (let day = 1; day <= daysInMonth; day++) {
      const cellDate = new Date(year, month, day);
      const disabled = cellDate < minDate;
      let classes = "wcb-dt-day";
      if (sameDay(cellDate, today)) classes += " is-today";
      if (sameDay(cellDate, selected)) classes += " is-selected";
      html +=
        '<button type="button" class="' + classes + '" data-day="' + day + '"' +
        (disabled ? " disabled" : "") +
        ' aria-label="' + day + " " + MONTHS[month] + " " + year + '"' +
        (sameDay(cellDate, selected) ? ' aria-current="date"' : "") +
        ">" + day + "</button>";
    }
    grid.innerHTML = html;

    monthSelect.value = String(month);
    yearSelect.value = String(year);
    prevButton.disabled = year === minDate.getFullYear() && month === minDate.getMonth();
    nextButton.disabled = year >= baseYear + YEARS_AHEAD && month === 11;
  }

  function position() {
    pop.classList.remove("is-above", "is-right");
    const box = pop.getBoundingClientRect();
    if (box.bottom > window.innerHeight && wrapper.getBoundingClientRect().top > box.height) {
      pop.classList.add("is-above");
    }
    if (pop.getBoundingClientRect().right > window.innerWidth) {
      pop.classList.add("is-right");
    }
  }

  // Returning focus to the input after closing would retrigger its focus
  // handler and immediately reopen the popup, so opening is suppressed for
  // that one tick.
  let suppressOpen = false;
  function refocusQuietly() {
    suppressOpen = true;
    display.focus();
    window.setTimeout(() => {
      suppressOpen = false;
    }, 0);
  }

  function openPicker() {
    if (open || suppressOpen) return;
    closeAllPickers();
    open = true;
    wrapper.classList.add("is-open");
    display.setAttribute("aria-expanded", "true");
    viewDate = startOfDay(selected || new Date());
    if (viewDate < minDate) viewDate = new Date(minDate);
    renderGrid();
    position();
  }

  function closePicker() {
    if (!open) return;
    open = false;
    closeSpinners();
    wrapper.classList.remove("is-open");
    display.setAttribute("aria-expanded", "false");
  }

  function pickDay(day: number) {
    selected = new Date(viewDate.getFullYear(), viewDate.getMonth(), day, chosenHour(), parseInt(minuteSelect.value, 10));
    commit(selected);
    renderGrid();
  }

  toggle.addEventListener("click", () => {
    if (open) closePicker();
    else {
      openPicker();
      display.focus();
    }
  });
  display.addEventListener("focus", openPicker);
  display.addEventListener("click", openPicker);

  display.addEventListener("input", () => {
    const parsed = parseValue(display.value);
    if (parsed) {
      selected = parsed;
      viewDate = startOfDay(parsed);
      showTime(parsed);
      hiddenInput.value = machineValue(parsed);
      renderGrid();
    } else {
      hiddenInput.value = "";
    }
  });

  display.addEventListener("blur", () => {
    // Normalise partial-but-valid typing, or discard unparseable text.
    window.setTimeout(() => {
      if (open) return;
      const parsed = parseValue(display.value);
      commit(parsed);
      if (parsed) selected = parsed;
    }, 150);
  });

  display.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && open) {
      event.stopPropagation();
      closePicker();
    } else if (event.key === "Enter") {
      event.preventDefault();
      closePicker();
    } else if (event.key === "ArrowDown" && !open) {
      event.preventDefault();
      openPicker();
    }
  });

  grid.addEventListener("click", (event) => {
    const button = (event.target as HTMLElement).closest<HTMLButtonElement>("[data-day]");
    if (button && !button.disabled) pickDay(parseInt(button.getAttribute("data-day") || "0", 10));
  });

  prevButton.addEventListener("click", () => {
    viewDate = new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1);
    renderGrid();
  });
  nextButton.addEventListener("click", () => {
    viewDate = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1);
    renderGrid();
  });
  monthSelect.addEventListener("change", () => {
    viewDate = new Date(viewDate.getFullYear(), parseInt(monthSelect.value, 10), 1);
    renderGrid();
  });
  yearSelect.addEventListener("change", () => {
    viewDate = new Date(parseInt(yearSelect.value, 10), viewDate.getMonth(), 1);
    renderGrid();
  });

  function applyTime() {
    if (!selected) return;
    selected.setHours(chosenHour(), parseInt(minuteSelect.value, 10), 0, 0);
    commit(selected);
  }

  pop.addEventListener("click", (event) => {
    // Selecting a day re-renders the grid, detaching the clicked button.
    event.stopPropagation();
    if (!(event.target as HTMLElement).closest(".wcb-dt-spin")) closeSpinners();

    const action = (event.target as HTMLElement).closest<HTMLElement>("[data-dt]");
    if (!action) return;
    if (action.getAttribute("data-dt") === "clear") {
      selected = null;
      commit(null);
      renderGrid();
      closePicker();
    } else if (action.getAttribute("data-dt") === "done") {
      closePicker();
      refocusQuietly();
    }
  });

  // Keeps a click inside the popup from blurring the input shut. Selects and
  // the time list are exempt, or their native/scroll interaction breaks.
  pop.addEventListener("mousedown", (event) => {
    if (!(event.target as HTMLElement).closest("select,.wcb-dt-spin-list")) {
      event.preventDefault();
    }
  });

  if (selected) commit(selected);
  renderGrid();

  return { close: closePicker };
}

/**
 * Enhances every `[data-wcb-datetime]` input under `root` into a calendar +
 * time popup. Returns a cleanup function that removes the document-level
 * listeners it attached; already-enhanced inputs are left alone (matches the
 * live picker's own idempotency guard), so calling this twice on the same DOM
 * (React Strict Mode's mount → cleanup → mount) is safe.
 */
export function attachDateTimePickers(root: ParentNode): () => void {
  const pickers: Picker[] = [];

  function closeAll() {
    pickers.forEach((picker) => picker.close());
  }

  const targets = root.querySelectorAll<HTMLInputElement>("[data-wcb-datetime]");
  targets.forEach((input) => {
    if (input.getAttribute("data-wcb-datetime-ready")) return;
    input.setAttribute("data-wcb-datetime-ready", "1");
    pickers.push(createPicker(input, closeAll));
  });

  const onDocumentClick = (event: MouseEvent) => {
    if (!(event.target as HTMLElement).closest(".wcb-datetime")) closeAll();
  };
  const onDocumentKeydown = (event: KeyboardEvent) => {
    if (event.key === "Escape") closeAll();
  };
  document.addEventListener("click", onDocumentClick);
  document.addEventListener("keydown", onDocumentKeydown);

  return () => {
    document.removeEventListener("click", onDocumentClick);
    document.removeEventListener("keydown", onDocumentKeydown);
  };
}
