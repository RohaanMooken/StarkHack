"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { EditorToggleBar } from "@/components/editorToggleBar";
import Placeholder from "@tiptap/extension-placeholder";
import { cn } from "@/lib/utils";
import "./editor.css";

export function Editor({ className, setEditorContent, editorPlaceholder="" }) {
	const editor = useEditor({
		extensions: [
			StarterKit,
			Placeholder.configure({
				placeholder: editorPlaceholder,
			}),
		],
		editorProps: {
			attributes: {
				class: "border rounded-lg p-4",
			},
		},
		// triggered on every change
		onUpdate: ({ editor }) => {
			const html = editor.getHTML();
			// send the content to an API here
			setEditorContent(html);
		},
	});

	return (
		<div className={cn("w-6/12", className)}>
			<EditorToggleBar editor={editor} />
			<EditorContent editor={editor} />
		</div>
	);
}
