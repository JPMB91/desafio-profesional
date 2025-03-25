export const StarRating = ({ value = 0, onChange, readOnly = false }) => {
  const handleClick = (newValue) => {
    if (!readOnly && onChange) {
      onChange(newValue);
    }
  };

  return (
    <div>
      {new Array(5).fill(0).map((_, index) => {
        const full = index + 1 <= value; 
        const half = index + 0.4 < value && index + 1 > value; 

        return (
          <span
            key={index}
            className={full ? "text-amber-500" : half ? "text-amber-500 half" : ""}
            onClick={() => handleClick(index + 1)}
            style={{ cursor: readOnly ? "default" : "pointer", position: "relative" }}
          >
            {full ? "★" : half ? "⯪" : "☆"} 
          </span>
        );
      })}
    </div>
  );
};
