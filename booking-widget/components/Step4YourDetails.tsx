"use client";

import PassengerIcon from "@/booking-widget/components/icons/PassengerIcon";
import CallIcon from "@/booking-widget/components/icons/CallIcon";
import { EmailIcon } from "@/booking-widget/components/icons/EmailIcon";
import { Form, FormInstance, Input, Select } from "antd";
import FormFieldError from "@/booking-widget/components/FormFieldError";
import CountryCode from "@/booking-widget/utils/countryCode.json";

const countryCodeOption = CountryCode?.filter(
  (item, index, self) =>
    index === self.findIndex((t) => t.dial_code === item.dial_code)
)?.map((res) => {
  return {
    value: res.dial_code,
    label: <span>{res.dial_code}</span>,
    key: res?.name
  };
});

interface Step4YourDetailsProps {
  form: FormInstance;
}

const Step4YourDetails: React.FC<Step4YourDetailsProps> = ({ form }) => {
  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <PassengerIcon />
        <span className="fw-semibold text-[#0d1b2e]">Passenger details</span>
      </div>

      <div className="flex items-center gap-2 border border-slate-200 rounded-xl px-3 h-[44px] transition-colors focus-within:border-[#0d1b2e] focus-within:ring-2 focus-within:ring-[#0d1b2e]/10">
        <span className="flex-shrink-0 flex items-center">
          <PassengerIcon />
        </span>
        <Form.Item
          name="name"
          className="w-100 mb-0 flex-1"
          noStyle
          rules={[
            {
              required: true,
              message: "Please enter the passenger name",
            },
          ]}
        >
          <Input
            size="large"
            variant="borderless"
            placeholder="Passenger Name*"
            className="!p-0 placeholder-gray-500 text-base"
          />
        </Form.Item>
      </div>
      <FormFieldError form={form} name="name" />

      <div className="phone_input_detail flex items-center gap-2 border border-slate-200 rounded-xl px-3 h-[44px] mt-3 transition-colors focus-within:border-[#0d1b2e] focus-within:ring-2 focus-within:ring-[#0d1b2e]/10">
        <span className="flex-shrink-0 flex items-center">
          <CallIcon />
        </span>
        <Form.Item
          className="mb-0 flex-shrink-0"
          initialValue="+61"
          name="country_code"
        >
          <Select
            prefixCls="number"
            style={{ width: 90 }}
            className="border-0 outline-none"
            showSearch
            options={countryCodeOption}
          />
        </Form.Item>
        <Form.Item
          className="w-100 mb-0 flex-1"
          name="phone"
          noStyle
          rules={[
            { required: true, message: "" },
            {
              validator: (_, value) => {
                if (!value) {
                  return Promise.reject("Please enter phone number");
                }
                if (value.startsWith("0")) {
                  return Promise.reject("Phone number should not start with 0");
                }
                if (!/^\d{6,10}$/.test(value)) {
                  return Promise.reject("Phone number must be between 6 to 10 digits");
                }
                return Promise.resolve();
              },
            },
          ]}
        >
          <Input
            variant="borderless"
            type="text"
            size="large"
            maxLength={10}
            placeholder="Enter your phone number*"
            className="w-100 !p-0 bg-transparent text-base input-placeholder"
            onPaste={(e) => {
              e.preventDefault();
              const pasted = e.clipboardData.getData("text");
              const digitsOnly = pasted.replace(/\D/g, "").replace(/^0+/, "");
              form.setFieldValue("phone", digitsOnly.slice(0, 10));
            }}
            onBlur={() => {
              const current = form.getFieldValue("phone");
              if (!current) return;
              const cleaned = String(current).replace(/\D/g, "").replace(/^0+/, "");
              if (cleaned !== current) form.setFieldValue("phone", cleaned);
            }}
          />
        </Form.Item>
      </div>
      <FormFieldError form={form} name="phone" />
      <small className="text-slate-400">Note: Please insert your phone number without the initial 0</small>

      <div className="flex items-center gap-2 border border-slate-200 rounded-xl px-3 h-[44px] mt-3 transition-colors focus-within:border-[#0d1b2e] focus-within:ring-2 focus-within:ring-[#0d1b2e]/10">
        <span className="flex-shrink-0 flex items-center [&_svg]:w-6 [&_svg]:h-6">
          <EmailIcon />
        </span>
        <Form.Item
          className="w-100 mb-0 flex-1"
          name="email"
          noStyle
          rules={[{ required: true, message: "Please enter email" }]}
        >
          <Input
            type="email"
            size="large"
            variant="borderless"
            placeholder="Email*"
            className="!p-0 placeholder-gray-500 text-base"
          />
        </Form.Item>
      </div>
      <FormFieldError form={form} name="email" />
    </div>
  );
};

export default Step4YourDetails;
