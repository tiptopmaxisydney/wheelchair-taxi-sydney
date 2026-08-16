"use client";

import { Drawer } from "antd";

interface PolicyDrawersProps {
  isTermsOpen: boolean;
  setIsTermsOpen: (open: boolean) => void;
  isRefundOpen: boolean;
  setIsRefundOpen: (open: boolean) => void;
}

const PolicyDrawers: React.FC<PolicyDrawersProps> = ({
  isTermsOpen,
  setIsTermsOpen,
  isRefundOpen,
  setIsRefundOpen,
}) => {
  return (
    <>
      <Drawer
        placement="right"
        open={isTermsOpen}
        mask={false}
        onClose={() => setIsTermsOpen(false)}
        title="Terms & Conditions"
        width={400}
      >
        <div className="text-[15px] leading-7 text-gray-700 space-y-4">
          <p className="font-semibold text-gray-900">
            By booking with Tiptop Ride you agree to the following:
          </p>

          <div className="space-y-3">

            <div>
              <p className="font-medium text-gray-900">Bookings and Details</p>
              <p>
                All bookings must be made through our official channels. Customers must provide correct pick up, drop off, passenger count, luggage, and any special requirements.
              </p>
            </div>

            <div>
              <p className="font-medium text-gray-900">Vehicle and Driver Confirmation</p>
              <p>
                Only enter the vehicle if the driver and vehicle details match your booking confirmation. If details do not match, contact Tiptop immediately.
              </p>
            </div>

            <div>
              <p className="font-medium text-gray-900">Fares and Payment</p>
              <p>
                Fares must be paid in full as agreed for the booking. Failure to pay may result in recovery action.
              </p>
            </div>

            <div>
              <p className="font-medium text-gray-900">Passenger Conduct</p>
              <p>
                Customers must behave respectfully and must not distract or interfere with the driver. Smoking, illegal substances, and unsafe behaviour are not allowed.
              </p>
            </div>

            <div>
              <p className="font-medium text-gray-900">Safety Requirements</p>
              <p>
                Seatbelts must be worn at all times. Children must use the correct child restraint as per NSW road rules.
              </p>
            </div>

            <div>
              <p className="font-medium text-gray-900">Wheelchair and Baby Seat Requests</p>
              <p>
                Wheelchair and baby seat requests must be made at the time of booking to ensure availability. Customers must be ready at the agreed pick up time to avoid delays.
              </p>
            </div>

            <div>
              <p className="font-medium text-gray-900">Cancellations and No Shows</p>
              <p>
                Customers must notify Tiptop as early as possible for any changes or cancellations. Cancellation fees may apply. A no show may result in a charge.
              </p>
            </div>

            <div>
              <p className="font-medium text-gray-900">Lost Property</p>
              <p>
                Customers are responsible for their belongings. Lost property will be handled through our process and storage or delivery fees may apply.
              </p>
            </div>

            <div>
              <p className="font-medium text-gray-900">Complaints and Feedback</p>
              <p>
                All issues must be reported to Tiptop through our customer support channels.
              </p>
            </div>

          </div>
        </div>

      </Drawer>
      <Drawer
        placement="right"
        open={isRefundOpen}
        mask={false}
        onClose={() => setIsRefundOpen(false)}
        title="Cancellation and Refund Policy"
        width={400}
      >
        <div className="text-[15px] leading-7 text-gray-700 space-y-3">
          <p className="font-medium text-gray-700">
            Please inform us at least <span className="font-semibold text-gray-900"> 3 hours before pickup </span> for any cancellation or changes.
            Late cancellations may result in loss of deposit or cancellation fees.
          </p>
          <p className="font-semibold text-gray-900 mt-4">
            Charges and Refunds:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-gray-700">
            <li>
              <span className="font-medium text-gray-900">Less than 3 hours:</span>
              {" "}100% charge, 0% refund
            </li>
            <li>
              <span className="font-medium text-gray-900">Up to 6 hours:</span>
              {" "}75% charge, 25% refund
            </li>
            <li>
              <span className="font-medium text-gray-900">Up to 12 hours:</span>
              {" "}50% charge, 50% refund
            </li>
            <li>
              <span className="font-medium text-gray-900">Up to 24 hours:</span>
              {" "}25% charge, 75% refund
            </li>
            <li>
              <span className="font-medium text-gray-900">More than 24 hours:</span>
              {" "}$25 fee, balance refunded
            </li>
          </ul>

          <p className="mt-3 text-gray-800">
            <span className="font-semibold">Rescheduling:</span>First change is free. Additional reschedules incur a $20 admin fee.
          </p>
        </div>

      </Drawer>
    </>
  );
};

export default PolicyDrawers;
