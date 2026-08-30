import React, { useMemo, useRef, useState } from "react";
import { AutoComplete, Input } from "antd";
import { SavedAddress, center, country } from "@/booking-widget/utils/api";
import { loadGoogleMapScript } from "@/booking-widget/utils/CommonFunctions";

export interface AddressSelection {
  address: string;
  lat: string;
  lng: string;
  name?: string;
  source: "local" | "google";
  place_id?: string;
  savedAddressId?: string;
}

interface AddressOption {
  value: string;
  label: React.ReactNode;
  source: "local" | "google";
  id?: string;
  place_id?: string;
  lat?: string;
  lng?: string;
  name?: string;
}

interface AddressAutocompleteProps {
  value?: string;
  onChange?: (value: string) => void;
  onResolve?: (result: AddressSelection) => void;
  placeholder?: string;
  className?: string;
  bordered?: boolean;
  disabled?: boolean;
}

const DETAIL_FIELDS = ["place_id", "formatted_address", "geometry", "name"];

// Strips Google's plus-code segment out of a formatted address, matching this
// app's existing address-display convention.
function stripPlusCode(address: string) {
  return address
    .split(",")
    .filter((part) => !part.includes("+"))
    .join(",")
    .replace(/^,\s*/, "");
}

function debounce<T extends (...args: any[]) => void>(fn: T, wait: number) {
  let timer: ReturnType<typeof setTimeout> | null = null;
  return (...args: Parameters<T>) => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => fn(...args), wait);
  };
}

// Small "S" / "G" pill next to each suggestion so it's clear which source it came from.
function renderOptionLabel(text: string, source: "local" | "google") {
  return (
    <div className="flex items-center justify-between gap-2">
      <span className="truncate">{text}</span>
      <span
        className={
          source === "local"
            ? "shrink-0 text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700"
            : "shrink-0 text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-blue-50 text-blue-700"
        }
      >
        {source === "local" ? "S" : "G"}
      </span>
    </div>
  );
}

function getBiasBounds(field: "pickup" | "other") {
  const km = field === "pickup" ? 50 : 165;
  const degreesChange = km / 111.32;
  const box = {
    north: center.lat + degreesChange,
    south: center.lat - degreesChange,
    east: center.lng + degreesChange / Math.cos((center.lat * Math.PI) / 180),
    west: center.lng - degreesChange / Math.cos((center.lat * Math.PI) / 180),
  };
  return new google.maps.LatLngBounds(
    new google.maps.LatLng(box.south, box.west),
    new google.maps.LatLng(box.north, box.east)
  );
}

// Local-first address search: only calls Google (after a debounce) when our own
// saved-address cache has no match, per the Places-cost-reduction design.
const AddressAutocomplete: React.FC<AddressAutocompleteProps & { biasField?: "pickup" | "other" }> = ({
  value,
  onChange,
  onResolve,
  placeholder,
  className,
  bordered = true,
  disabled,
  biasField = "other",
}) => {
  const [options, setOptions] = useState<AddressOption[]>([]);
  const fetchRef = useRef(0);
  const sessionTokenRef = useRef<google.maps.places.AutocompleteSessionToken | null>(null);
  const autocompleteServiceRef = useRef<google.maps.places.AutocompleteService | null>(null);
  const placesServiceRef = useRef<google.maps.places.PlacesService | null>(null);

  const ensureGoogleServices = () =>
    new Promise<void>((resolve) => {
      loadGoogleMapScript(() => {
        if (!autocompleteServiceRef.current) {
          autocompleteServiceRef.current = new google.maps.places.AutocompleteService();
        }
        if (!placesServiceRef.current) {
          placesServiceRef.current = new google.maps.places.PlacesService(document.createElement("div"));
        }
        if (!sessionTokenRef.current) {
          sessionTokenRef.current = new google.maps.places.AutocompleteSessionToken();
        }
        resolve();
      });
    });

  const runSearch = async (text: string) => {
    fetchRef.current += 1;
    const fetchId = fetchRef.current;

    if (!text || text.trim().length < 2) {
      setOptions([]);
      return;
    }

    try {
      const localRes: any = await SavedAddress.search(text);
      if (fetchId !== fetchRef.current) return;

      const localResults = localRes?.data || [];
      if (localResults.length > 0) {
        setOptions(
          localResults.map((item: any) => ({
            value: item.display_name,
            label: renderOptionLabel(item.display_name, "local"),
            source: "local",
            id: item._id,
            lat: String(item.latitude),
            lng: String(item.longitude),
            name: item.display_name,
          }))
        );
        return;
      }
    } catch (err) {
      console.log("saved address search error", err);
    }

    await ensureGoogleServices();
    if (fetchId !== fetchRef.current || !autocompleteServiceRef.current) return;

    autocompleteServiceRef.current.getPlacePredictions(
      {
        input: text,
        sessionToken: sessionTokenRef.current,
        bounds: getBiasBounds(biasField),
        componentRestrictions: { country },
        strictBounds: true,
      } as any,
      (predictions, status) => {
        if (fetchId !== fetchRef.current) return;
        if (status !== google.maps.places.PlacesServiceStatus.OK || !predictions) {
          setOptions([]);
          return;
        }
        setOptions(
          predictions.map((p) => ({
            value: p.description,
            label: renderOptionLabel(p.description, "google"),
            source: "google",
            place_id: p.place_id,
          }))
        );
      }
    );
  };

  const debouncedSearch = useMemo(() => debounce(runSearch, 400), []);

  const handleSelect = async (selected: string, option: AddressOption) => {
    if (option.source === "local") {
      if (option.id) {
        SavedAddress.markUsed(option.id).catch((err: any) => console.log("saved address markUsed error", err));
      }
      onChange?.(option.value);
      onResolve?.({
        address: option.value,
        lat: option.lat || "",
        lng: option.lng || "",
        name: option.name,
        source: "local",
        savedAddressId: option.id,
      });
      return;
    }

    await ensureGoogleServices();
    if (!placesServiceRef.current || !option.place_id) return;

    placesServiceRef.current.getDetails(
      { placeId: option.place_id, fields: DETAIL_FIELDS, sessionToken: sessionTokenRef.current || undefined },
      (place, status) => {
        sessionTokenRef.current = new google.maps.places.AutocompleteSessionToken();
        if (status !== google.maps.places.PlacesServiceStatus.OK || !place) return;

        // Keep the exact text the user picked from the dropdown rather than Google's
        // resolved formatted_address, which can drop a landmark's name (e.g. selecting
        // "Sydney Opera House..." would otherwise come back as "Bennelong Point...").
        const address = stripPlusCode(selected);
        const lat = place.geometry?.location?.lat().toString() || "";
        const lng = place.geometry?.location?.lng().toString() || "";

        if (place.geometry?.location) {
          SavedAddress.resolve({
            place_id: place.place_id,
            formatted_address: address,
            latitude: place.geometry.location.lat(),
            longitude: place.geometry.location.lng(),
            name: place.name,
          }).catch((err: any) => console.log("saved address resolve error", err));
        }

        onChange?.(address);
        onResolve?.({ address, lat, lng, name: place.name, source: "google", place_id: place.place_id });
      }
    );
  };

  return (
    <AutoComplete
      value={value}
      options={options}
      style={{ width: "100%" }}
      disabled={disabled}
      onSearch={(text) => {
        onChange?.(text);
        debouncedSearch(text);
      }}
      onSelect={(selected, option) => handleSelect(selected, option as AddressOption)}
      onFocus={() => {
        ensureGoogleServices();
      }}
    >
      <Input
        type="text"
        size="large"
        bordered={bordered}
        className={className}
        placeholder={placeholder}
      />
    </AutoComplete>
  );
};

export default AddressAutocomplete;
