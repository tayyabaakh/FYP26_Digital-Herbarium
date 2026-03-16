import React from 'react';

const GeneralCardDetail = ({ title, icon, fields }) => {
  return (
    <div className="bg-white dark:bg-white rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-800">
      <div className="flex items-center gap-2 mb-6 border-b border-slate-100 dark:border-slate-800 pb-3">
        <span className="material-symbols-outlined text-primary">{icon}</span>
        <h3 className="text-lg font-bold text-slate-900 dark:text-black">{title}</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
        {fields.map((field, index) => (
          <div key={index} className={field.fullWidth ? "col-span-full" : ""}>
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-700 mb-1">
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