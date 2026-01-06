'use client';

import { useState } from 'react';
import { TextElement } from '@/lib/types';

interface TextElementsEditorProps {
  textElements: TextElement[];
  onChange: (elements: TextElement[]) => void;
}

export default function TextElementsEditor({ textElements, onChange }: TextElementsEditorProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState<Partial<TextElement>>({
    content: '',
    x: 50,
    y: 50,
    fontSize: 16,
    fontFamily: 'monospace',
    color: '#FFFFFF',
    align: 'center',
    visible: true,
  });

  const handleAdd = () => {
    setEditingId(null);
    setFormData({
      content: '',
      x: 50,
      y: 50,
      fontSize: 16,
      fontFamily: 'monospace',
      color: '#FFFFFF',
      align: 'center',
      visible: true,
    });
    setShowForm(true);
  };

  const handleEdit = (element: TextElement) => {
    setEditingId(element.id);
    setFormData(element);
    setShowForm(true);
  };

  const handleSave = () => {
    if (!formData.content?.trim()) {
      alert('Text content is required');
      return;
    }

    if (editingId) {
      // Update existing element
      onChange(
        textElements.map((el) =>
          el.id === editingId ? { ...formData, id: editingId } as TextElement : el
        )
      );
    } else {
      // Add new element
      const newElement: TextElement = {
        ...formData,
        id: `text-${Date.now()}`,
      } as TextElement;
      onChange([...textElements, newElement]);
    }

    setShowForm(false);
    setEditingId(null);
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete this text element?')) {
      onChange(textElements.filter((el) => el.id !== id));
    }
  };

  const handleToggleVisibility = (id: string) => {
    onChange(
      textElements.map((el) =>
        el.id === id ? { ...el, visible: !el.visible } : el
      )
    );
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
  };

  return (
    <div className="space-y-4">
      {/* List of existing text elements */}
      {textElements.length > 0 && (
        <div className="space-y-2">
          {textElements.map((element) => (
            <div
              key={element.id}
              className="p-3 bg-neutral-800 border border-neutral-700 rounded space-y-2"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className={`text-sm ${!element.visible ? 'text-neutral-500 line-through' : ''}`}>
                    {element.content}
                  </p>
                  <p className="text-xs text-neutral-600 mt-1">
                    Position: ({element.x}%, {element.y}%) • Size: {element.fontSize}px • {element.align}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleToggleVisibility(element.id)}
                    className="text-xs text-neutral-500 hover:text-white transition-colors uppercase tracking-widest"
                    title={element.visible ? 'Hide' : 'Show'}
                  >
                    {element.visible ? '👁️' : '👁️‍🗨️'}
                  </button>
                  <button
                    onClick={() => handleEdit(element)}
                    className="text-xs text-neutral-500 hover:text-white transition-colors uppercase tracking-widest"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(element.id)}
                    className="text-xs text-red-500 hover:text-red-400 transition-colors uppercase tracking-widest"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add button */}
      {!showForm && (
        <button
          onClick={handleAdd}
          className="w-full py-3 bg-neutral-800 hover:bg-neutral-700 transition-colors text-xs uppercase tracking-widest border border-neutral-700"
        >
          + Add Text Element
        </button>
      )}

      {/* Add/Edit form */}
      {showForm && (
        <div className="p-4 bg-neutral-800 border border-neutral-700 rounded-lg space-y-4">
          <h4 className="text-xs uppercase tracking-wider text-neutral-400">
            {editingId ? 'Edit Text Element' : 'New Text Element'}
          </h4>

          {/* Content */}
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-widest text-neutral-500">Text Content</label>
            <textarea
              value={formData.content || ''}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 text-white focus:border-white outline-none resize-none"
              rows={3}
              placeholder="Enter your text..."
            />
          </div>

          {/* Position */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-widest text-neutral-500">
                X Position: {formData.x}%
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={formData.x || 50}
                onChange={(e) => setFormData({ ...formData, x: parseInt(e.target.value) })}
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-widest text-neutral-500">
                Y Position: {formData.y}%
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={formData.y || 50}
                onChange={(e) => setFormData({ ...formData, y: parseInt(e.target.value) })}
                className="w-full"
              />
            </div>
          </div>

          {/* Font settings */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-widest text-neutral-500">Font Family</label>
              <select
                value={formData.fontFamily || 'monospace'}
                onChange={(e) => setFormData({ ...formData, fontFamily: e.target.value })}
                className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 text-white focus:border-white outline-none"
              >
                <option value="monospace">Monospace</option>
                <option value="sans-serif">Sans Serif</option>
                <option value="serif">Serif</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-widest text-neutral-500">
                Font Size: {formData.fontSize}px
              </label>
              <input
                type="range"
                min="10"
                max="48"
                value={formData.fontSize || 16}
                onChange={(e) => setFormData({ ...formData, fontSize: parseInt(e.target.value) })}
                className="w-full"
              />
            </div>
          </div>

          {/* Color and alignment */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-widest text-neutral-500">Text Color</label>
              <input
                type="color"
                value={formData.color || '#FFFFFF'}
                onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                className="w-full h-10 bg-neutral-900 border border-neutral-700"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-widest text-neutral-500">Alignment</label>
              <select
                value={formData.align || 'center'}
                onChange={(e) => setFormData({ ...formData, align: e.target.value as 'left' | 'center' | 'right' })}
                className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 text-white focus:border-white outline-none"
              >
                <option value="left">Left</option>
                <option value="center">Center</option>
                <option value="right">Right</option>
              </select>
            </div>
          </div>

          {/* Action buttons */}
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={handleCancel}
              className="py-2 bg-neutral-900 hover:bg-neutral-800 transition-colors text-xs uppercase tracking-widest border border-neutral-700"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="py-2 bg-white text-black hover:bg-neutral-200 transition-colors text-xs uppercase tracking-widest"
            >
              {editingId ? 'Update' : 'Add'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
