import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';
import React from 'react';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
}

const modules = {
  toolbar: [
    ['bold', 'italic', 'underline'],
    [{ color: [] }],
    ['link'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    ['clean'],
  ],
};

export default function RichTextEditor({ value, onChange }: RichTextEditorProps) {
  return <ReactQuill theme="snow" value={value} onChange={onChange} modules={modules} />;
}