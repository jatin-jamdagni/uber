const LocationSearchPanel = ({
  suggestions = [],  // Default to empty array if suggestions is not passed or is null
  setPickup,
  setDestination,
  activeField,
}: any) => {
  const handleSuggestionClick = (suggestion: any) => {
    if (activeField === "pickup") {
      setPickup(suggestion.description || suggestion.formatted_address); // Make sure you pick the correct field
    } else if (activeField === "destination") {
      setDestination(suggestion.description || suggestion.formatted_address); // Make sure you pick the correct field
    }
  };

  return (
    <div>
      {suggestions && suggestions.length > 0 ? (
        suggestions.map((elem, idx) => (
          <div
            key={idx}
            onClick={() => handleSuggestionClick(elem)}
            className="flex gap-4 border-2 p-3 border-gray-50 active:border-black rounded-xl items-center my-2 justify-start"
          >
            <h2 className="bg-[#eee] h-8 flex items-center justify-center w-12 rounded-full">
              <i className="ri-map-pin-fill"></i>
            </h2>
            <h4 className="font-medium">{elem.description || elem.formatted_address}</h4>
          </div>
        ))
      ) : (
        <p>No suggestions available</p>  // Optionally, display a message when no suggestions are available
      )}
    </div>
  );
};

export default LocationSearchPanel