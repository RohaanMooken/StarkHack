"use client";
import {
	Bold,
	Italic,
	Underline,
	Strikethrough,
	AlignLeft,
	AlignCenter,
	AlignRight,
} from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useState } from "react";

export function EditorToggleBar({ editor }) {
	if (!editor) return null;

	const [value, setValue] = useState("bold");

	function onChange(value) {
		switch (value) {
			case "bold":
				editor.chain().focus().toggleBold().run();
				break;
			case "italic":
				editor.chain().focus().toggleItalic().run();
				break;
			case "underline":
				editor.chain().focus().toggleUnderline().run();
				break;
			case "strikethrough":
				editor.chain().focus().toggleStrike().run();
				break;
			case "alignleft":
				editor.chain().focus().setTextAlign("left").run();
				break;
			case "aligncenter":
				editor.chain().focus().setTextAlign("center").run();
				break;
			case "alignright":
				editor.chain().focus().setTextAlign("right").run();
				break;
			case "h1":
				editor.chain().focus().setHeading({ level: 1 }).run();
				break;
			case "h2":
				editor.chain().focus().setHeading({ level: 2 }).run();
				break;
			case "h3":
				editor.chain().focus().setHeading({ level: 3 }).run();
				break;
			default:
				break;
		}
	}

	return (
		<ToggleGroup
			type="single"
			value={value}
			onValueChange={(value) => {
				if (value) setValue(value);
				onChange(value);
			}}
		>
			<ToggleGroupItem value="h1">H1</ToggleGroupItem>
			<ToggleGroupItem value="h2">H2</ToggleGroupItem>
			<ToggleGroupItem value="h3">H3</ToggleGroupItem>
			<ToggleGroupItem value="bold">
				<Bold className="h-4 w-4" />
			</ToggleGroupItem>
			<ToggleGroupItem value="italic">
				<Italic className="h-4 w-4" />
			</ToggleGroupItem>
			<ToggleGroupItem value="underline">
				<Underline className="h-4 w-4" />
			</ToggleGroupItem>
			<ToggleGroupItem value="strikethrough">
				<Strikethrough className="h-4 w-4" />
			</ToggleGroupItem>
			<ToggleGroupItem value="alignleft">
				<AlignLeft className="h-4 w-4" />
			</ToggleGroupItem>
			<ToggleGroupItem value="aligncenter">
				<AlignCenter className="h-4 w-4" />
			</ToggleGroupItem>
			<ToggleGroupItem value="alignright">
				<AlignRight className="h-4 w-4" />
			</ToggleGroupItem>
		</ToggleGroup>
	);
}
