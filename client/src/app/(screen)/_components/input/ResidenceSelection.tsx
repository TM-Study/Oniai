import React from "react";
  
interface ResidenceOption {
  label: string;
}

const residenceOptions: ResidenceOption[] = [
  { label: '未選択'},
  { label: '北海道' },
  { label: '青森' },
  { label: '岩手' },
  { label: '宮城' },
  { label: '秋田' },
  { label: '山形' },
  { label: '福島' },
  { label: '茨城' },
  { label: '栃木' },
  { label: '群馬' },
  { label: '埼玉' },
  { label: '千葉' },
  { label: '東京' },
  { label: '神奈川' },
  { label: '新潟' },
  { label: '富山' },
  { label: '石川' },
  { label: '福井' },
  { label: '山梨' },
  { label: '長野' },
  { label: '岐阜' },
  { label: '静岡' },
  { label: '愛知' },
  { label: '三重' },
  { label: '滋賀' },
  { label: '京都' },
  { label: '大阪' },
  { label: '兵庫' },
  { label: '奈良' },
  { label: '和歌山' },
  { label: '鳥取' },
  { label: '島根' },
  { label: '岡山' },
  { label: '広島' },
  { label: '山口' },
  { label: '徳島' },
  { label: '香川' },
  { label: '愛媛' },
  { label: '高知' },
  { label: '福岡' },
  { label: '佐賀' },
  { label: '長崎' },
  { label: '熊本' },
  { label: '大分' },
  { label: '宮崎' },
  { label: '鹿児島' },
  { label: '沖縄' }
];

const ResidenceSelection: React.FC<{ value?: string, onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void }> = ({ value, onChange }) => (
  <>
  <div className="mt-5">
    <label htmlFor="residence" className="block text-sm/6 font-medium text-gray-900">
      居住地
    </label>
    <div className="mt-2">
      <select
        id="residence"
        name="residence"
        value={value || ''}
        onChange={onChange}
        autoComplete="residence-name"
        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6"
      >
        {residenceOptions.map(option => (
          <option key={option.label}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  </div>
  </>
);

export default ResidenceSelection;
