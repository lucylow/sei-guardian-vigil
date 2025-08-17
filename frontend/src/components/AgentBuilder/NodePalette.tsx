import React from 'react';
import { motion } from 'framer-motion';

const nodeTemplates = [
	{
		type: 'agentPersonality',
		label: '🤖 Personality',
		description: 'Define agent personality and communication style',
		color: 'bg-purple-500',
	},
	{
		type: 'skill',
		label: '🧠 Skills',
		description: 'Add AI capabilities and knowledge domains',
		color: 'bg-blue-500',
	},
	{
		type: 'trigger',
		label: '⚡ Triggers',
		description: 'Set when the agent should activate',
		color: 'bg-green-500',
	},
	{
		type: 'action',
		label: '🎯 Actions',
		description: 'Define what the agent can do',
		color: 'bg-orange-500',
	},
	{
		type: 'seiIntegration',
		label: '⛓️ Sei Blockchain',
		description: 'Connect to Sei network for transactions',
		color: 'bg-red-500',
	},
	{
		type: 'output',
		label: '📤 Output',
		description: 'Format and deliver agent responses',
		color: 'bg-gray-500',
	},
];

export default function NodePalette({ onAddNode }) {
	const onDragStart = (event, nodeType) => {
		event.dataTransfer.setData('application/reactflow', nodeType);
		event.dataTransfer.effectAllowed = 'move';
	};

	return (
		<div className="w-80 bg-white border-r border-gray-200 p-4 overflow-y-auto">
			<h3 className="text-lg font-bold mb-4 text-gray-800">
				🛠️ Agent Components
			</h3>
			<div className="mb-4">
				<button
					className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-3 py-2 rounded font-bold w-full mb-2"
					onClick={() =>
						window.alert(
							'Select a template from the dropdown above to pre-load curated agents!'
						)
					}
				>
					🎯 Load Hackathon Templates
				</button>
			</div>
			<div className="space-y-3">
				{nodeTemplates.map((template) => (
					<motion.div
						key={template.type}
						className={`${template.color} text-white p-4 rounded-lg cursor-grab active:cursor-grabbing shadow-sm hover:shadow-md transition-shadow`}
						draggable
						onDragStart={(e) => onDragStart(e, template.type)}
						whileHover={{ scale: 1.02 }}
						whileTap={{ scale: 0.98 }}
					>
						<div className="font-semibold text-sm">{template.label}</div>
						<div className="text-xs opacity-90 mt-1">
							{template.description}
						</div>
					</motion.div>
				))}
			</div>
		</div>
	);
}
