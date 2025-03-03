import React from "react";
  
interface SexOption {
  label: string;
  value: string;
}

// 選択肢
const sexOptions: SexOption[] = [
  { label: '未選択', value: '' },
  { label: '男性', value: '1' },
  { label: '女性', value: '2' },
];

interface props {
  value?: string;
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}

const SexSelectionArea: React.FC<props> = ({ value, onChange }) => (
  <>
  <div className="mt-5">

    {/* タイトルラベル */}
    <label htmlFor="sex" className="block text-sm/6 font-medium text-gray-900">
      性別
    </label>

    {/* セレクトボックス */}
    <div className="mt-2">
      <select
        id="sex"
        name="sex"
        value={value || ''}
        onChange={onChange}
        autoComplete="sex-name"
        required
        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6"
      >
        {sexOptions.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  </div>
  </>
);

export default SexSelectionArea;
