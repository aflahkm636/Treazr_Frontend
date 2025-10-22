import React, { useState } from "react";
import { FaEdit, FaTrash, FaCheck, FaChevronDown, FaChevronUp } from "react-icons/fa";

const AddressList = ({
  addresses = [],
  selectedAddress = null,
  onAddressSelect,
  onEditAddress,
  onDeleteAddress,
  onAddNewAddress,
}) => {
  const [showAll, setShowAll] = useState(false);
  const [expandedAddressId, setExpandedAddressId] = useState(null);

  const visibleAddresses = showAll ? addresses : addresses.slice(0, 4);

  if (addresses.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="bg-gray-100 rounded-lg p-6 max-w-md mx-auto">
          <p className="text-gray-500 mb-4">No saved addresses found.</p>
          <button
            onClick={onAddNewAddress}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Add Your First Address
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {visibleAddresses.map((address) => {
        const addressId = address._id || address.id;
        const isSelected = selectedAddress?._id === addressId || selectedAddress?.id === addressId;
        const isExpanded = expandedAddressId === addressId;

        return (
          <div
            key={addressId}
            className={`p-4 border rounded-lg cursor-pointer transition-all ${
              isSelected
                ? "border-indigo-500 bg-indigo-50 shadow-sm"
                : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
            }`}
            onClick={() => onAddressSelect(address)}
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-start gap-3">
                  {isSelected && (
                    <FaCheck className="text-indigo-600 mt-1 flex-shrink-0" />
                  )}
                  <div>
                    <p className="font-medium text-gray-900">{address.street}</p>
                    <p className="text-gray-600 text-sm">
                      {address.city}, {address.state}
                    </p>

                    {/* Show more details only when expanded */}
                    {isExpanded && (
                      <div className="text-gray-500 text-sm mt-1 space-y-0.5">
                        <p>
                          ZIP: {address.zip} | {address.country}
                        </p>
                        {address.phone && <p>Phone: {address.phone}</p>}
                      </div>
                    )}

                    {/* Toggle for more/less details */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setExpandedAddressId(isExpanded ? null : addressId);
                      }}
                      className="text-indigo-600 text-sm font-medium mt-2 hover:underline flex items-center gap-1"
                    >
                      {isExpanded ? (
                        <>
                          View less <FaChevronUp className="text-xs" />
                        </>
                      ) : (
                        <>
                          View more <FaChevronDown className="text-xs" />
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {isSelected && (
                  <div className="mt-2 text-sm text-indigo-600 font-medium flex items-center">
                    ✓ Selected for delivery
                  </div>
                )}
              </div>

              <div className="flex gap-2 ml-4 flex-shrink-0">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEditAddress(address);
                  }}
                  className="p-2 text-gray-600 hover:text-indigo-600 transition-colors rounded-full hover:bg-indigo-50"
                  title="Edit address"
                >
                  <FaEdit />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteAddress(addressId);
                  }}
                  className="p-2 text-gray-600 hover:text-red-600 transition-colors rounded-full hover:bg-red-50"
                  title="Delete address"
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          </div>
        );
      })}

      {/* Toggle button to show/hide remaining addresses */}
      {addresses.length > 4 && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="w-full text-indigo-600 font-medium flex items-center justify-center gap-1 mt-2 hover:underline"
        >
          {showAll ? (
            <>
              Show less <FaChevronUp className="text-xs" />
            </>
          ) : (
            <>
              Show all ({addresses.length - 4} more) <FaChevronDown className="text-xs" />
            </>
          )}
        </button>
      )}

      {/* Add new address button */}
      <button
        onClick={onAddNewAddress}
        className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:text-indigo-600 hover:border-indigo-400 transition-colors flex items-center justify-center gap-2"
      >
        <FaEdit className="text-lg" />
        Add New Address
      </button>
    </div>
  );
};

export default AddressList;
