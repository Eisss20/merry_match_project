import React from "react";

// payment/packages
export const SkeletonMembership = ({ count = 1 }) => {
  return (
    <section className="bg-utility-primary p-5">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 lg:p-20">
        {Array.from({ length: count }).map((_, index) => (
          <div
            key={index}
            className="flex animate-pulse flex-col gap-3 rounded-3xl border-2 bg-gray-100 p-6 shadow-md"
          >
            <div className="h-16 w-16 rounded-2xl bg-gray-300"></div>
            <div className="h-6 w-2/3 bg-gray-300"></div>
            <div className="h-6 w-1/3 bg-gray-300"></div>
            <div className="h-4 w-full bg-gray-300"></div>
            <div className="h-4 w-4/5 bg-gray-300"></div>
            <div className="h-12 w-full bg-gray-300"></div>
          </div>
        ))}
      </div>
    </section>
  );
};

// Payment/paymentMembership
export const SkeletonPaymentMembershipPackage = () => {
  return (
    <section className="mt-8">
      <h2 className="text-lg font-bold lg:text-left lg:text-xl">
        Merry Membership Package
      </h2>
      <div className="relative mt-4 animate-pulse rounded-[24px] bg-gray-100 p-6">
        <div className="flex flex-col gap-4 lg:flex-row">
          {/* Icon */}
          <div className="h-[60px] w-[60px] rounded-lg bg-gray-300"></div>

          {/* Title and Price */}
          <div className="flex flex-col gap-2">
            <div className="h-6 w-3/4 rounded-md bg-gray-300"></div>
            <div className="h-5 w-1/3 rounded-md bg-gray-300"></div>
          </div>

          {/* Details */}
          <div className="grid gap-3 lg:pl-20">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="h-4 w-4/5 rounded-md bg-gray-300"
              ></div>
            ))}
          </div>
        </div>

        <hr className="my-6 border-gray-300" />

        {/* Dates */}
        <div className="mt-6 flex flex-col gap-3 text-sm lg:hidden">
          <div className="flex justify-between">
            <div className="h-4 w-1/4 rounded-md bg-gray-300"></div>
            <div className="h-4 w-1/3 rounded-md bg-gray-300"></div>
          </div>
          <div className="flex justify-between">
            <div className="h-4 w-1/4 rounded-md bg-gray-300"></div>
            <div className="h-4 w-1/3 rounded-md bg-gray-300"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Payment/paymentMembership
export const SkeletonPaymentMembershipHistory = () => {
  return (
    <div className="mt-8 animate-pulse rounded-[24px] bg-gray-100 p-6">
      <div className="mb-4 h-6 w-1/4 rounded-md bg-gray-300"></div>
      {Array.from({ length: 20 }).map((_, index) => (
        <div
          key={index}
          className={`mb-2 h-4 w-full rounded-md bg-gray-300 ${
            index % 2 === 0 ? "bg-opacity-50" : ""
          }`}
        ></div>
      ))}
    </div>
  );
};
