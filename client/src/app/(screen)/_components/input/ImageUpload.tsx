import { UserCircleIcon } from '@heroicons/react/24/solid';
import React, { useState } from 'react';

const ImageUpload: React.FC<{value?: string | ArrayBuffer | null, onChange: (event: React.ChangeEvent<HTMLInputElement>) => void}> = ({ value, onChange }) => {
  const [imagePreview, setImagePreview] = useState<string | ArrayBuffer | null>(`data:image/jpg;base64,${value}` || null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        onChange(e);
      };
      reader.onerror = (error) => {
        console.error('File reading error:', error);
        alert('画像の読み込みに失敗しました。');
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <>
      <div className="flex flex-col justify-center items-center">
        {imagePreview && typeof imagePreview === 'string' ? (
          <div>
            <img
              src={imagePreview}
              alt="Profile Image"
              className="w-40 h-40 object-cover"
            />
          </div>
        ) : (
          <UserCircleIcon className='w-40 h-40' />
        )}
      <label
        htmlFor="image"
        className="mt-4 flex w-1/2 justify-center rounded-md px-3 py-1.5 text-sm/6 font-semibold text-black shadow-sm border border-black hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
      >
        画像を選択
      </label>
      </div>
      <input
        id="image"
        name="image"
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        className="hidden"
        aria-label="プロフィール画像を選択"
      />
    </>
  );
};

export default ImageUpload;
