import React from 'react';
import { ReactFlowProvider } from '@xyflow/react';
import VisualAgentBuilder from './VisualAgentBuilder';

export default function VisualAgentBuilderWrapper() {
  return (
    <ReactFlowProvider>
      <VisualAgentBuilder />
    </ReactFlowProvider>
  );
}
