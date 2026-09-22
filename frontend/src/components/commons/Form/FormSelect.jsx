const FormSelect = ({
  label,
  name,
  value,
  onChange,
  options,
  required = false,
}) => {
  return (
    <div>
      <label className="mb-2 block text-[13px] font-medium text-[#0b2d1d]">
        {label}

        {required && (
          <span className="ml-1 text-red-500">
            *
          </span>
        )}
      </label>

      <select
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className="h-10 w-full rounded-lg border border-[#cfe4d5] bg-[#f1fbf4] px-3 text-[13px] outline-none focus:border-[#16a34a] focus:ring-1 focus:ring-[#16a34a]"
      >
        <option value="">
          Select {label}...
        </option>

        {options.map((option) => (
          <option
            key={option}
            value={option}
          >
            {option}
          </option>
        ))}
      </select>
    </div>
  );
};

export default FormSelect;