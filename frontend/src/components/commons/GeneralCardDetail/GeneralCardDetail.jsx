import React from 'react';

const GeneralCardDetail = ({ title, icon, fields }) => {
  return (
    <div className="bg-[#2D3E33] dark:bg-[#2D3E33] rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-800">
      <div className="flex items-center gap-2 mb-6 border-b border-slate-100 dark:border-slate-800 pb-3">
        <span className="material-symbols-outlined text-amber-50">{icon}</span>
        <h3 className="text-lg font-bold  dark:text-black text-amber-50">{title}</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
        {fields.map((field, index) => (
          <div key={index} className={field.fullWidth ? "col-span-full" : ""}>
            <p className="text-[10px] font-bold uppercase tracking-wider  mb-1 text-amber-50">
              {field.label}
            </p>
            <div className="text-base font-medium text-slate-900 dark:text-black">
              {field.render ? field.render() : field.value}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GeneralCardDetail;