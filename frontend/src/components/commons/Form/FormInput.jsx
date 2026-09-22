const FormInput = ({
  label,
  name,
  value,
  onChange,
  placeholder,
  type = "text",
  required = false,
  step,
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

      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        step={step}
        className="h-10 w-full rounded-lg border border-[#cfe4d5] bg-[#f1fbf4] px-3 text-[13px] outline-none placeholder:text-[#88a496] focus:border-[#16a34a] focus:ring-1 focus:ring-[#16a34a]"
      />
    </div>
  );
};

export default FormInput;