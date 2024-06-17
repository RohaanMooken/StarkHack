"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { EditorToggleBar } from "@/components/editorToggleBar";
import { useEffect } from "react";

export function Editor({ setEditorContent }) {
	const editor = useEditor({
		extensions: [StarterKit],
		editorProps: {
			attributes: {
				class: "border rounded-lg p-4",
			},
		},
		// triggered on every change
		onUpdate: ({ editor }) => {
			const html = editor.getHTML()
			// send the content to an API here
			setEditorContent(html);
		  },
	});

	return (
		<div className="w-6/12">
			<EditorToggleBar editor={editor} />
			<EditorContent editor={editor} />
		</div>
	);
}
