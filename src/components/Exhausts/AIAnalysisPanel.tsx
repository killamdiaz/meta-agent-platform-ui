import { useState } from "react";
import { AIAnalysis, AIFinding } from "@/data/mockExhausts";
import { cn } from "@/lib/utils";
import { Brain, AlertCircle, Lightbulb, History, Stethoscope, ChevronDown, ChevronUp } from "lucide-react";

interface AIAnalysisPanelProps {
  analysis: AIAnalysis;
  className?: string;
}

const findingIcons = {
  error_pattern: AlertCircle,
  suggestion: Lightbulb,
  match: History,
  diagnosis: Stethoscope
};

const severityColors = {
  critical: 'border-l-red-500 bg-red-500/5',
  warning: 'border-l-amber-500 bg-amber-500/5',
  info: 'border-l-blue-500 bg-blue-500/5'
};

const severityIconColors = {
  critical: 'text-red-400',
  warning: 'text-amber-400',
  info: 'text-blue-400'
};

const FindingCard = ({ finding }: { finding: AIFinding }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const Icon = findingIcons[finding.type];
  const severity = finding.severity || 'info';

  const renderContent = (content: string) => {
    // Simple markdown-like rendering
    return content.split('\n').map((line, i) => {
      // Code block
      if (line.startsWith('```')) {
        return null;
      }
      if (line.includes('```')) {
        return null;
      }
      
      // Bold
      const boldRegex = /\*\*(.*?)\*\*/g;
      let processedLine = line.replace(boldRegex, '<strong class="text-foreground">$1</strong>');
      
      // Inline code
      const codeRegex = /`([^`]+)`/g;
      processedLine = processedLine.replace(codeRegex, '<code class="px-1.5 py-0.5 rounded bg-muted text-xs font-mono">$1</code>');
      
      // List items
      if (line.startsWith('- ')) {
        return (
          <li key={i} className="ml-4 list-disc" dangerouslySetInnerHTML={{ __html: processedLine.slice(2) }} />
        );
      }
      if (/^\d+\.\s/.test(line)) {
        return (
          <li key={i} className="ml-4 list-decimal" dangerouslySetInnerHTML={{ __html: processedLine.replace(/^\d+\.\s/, '') }} />
        );
      }
      
      return (
        <p key={i} className={cn(line.trim() === '' ? 'h-2' : '')} dangerouslySetInnerHTML={{ __html: processedLine }} />
      );
    });
  };

  // Extract code blocks
  const codeBlockMatch = finding.content.match(/```(\w+)?\n([\s\S]*?)```/);

  return (
    <div className={cn(
      "border-l-2 rounded-r-lg p-4 transition-all",
      severityColors[severity]
    )}>
      <button
        className="flex items-start justify-between w-full text-left"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-start gap-3">
          <Icon className={cn("w-5 h-5 mt-0.5 shrink-0", severityIconColors[severity])} />
          <div>
            <h4 className="font-medium text-sm text-foreground">{finding.title}</h4>
            <p className="text-xs text-muted-foreground mt-0.5">
              {new Date(finding.timestamp).toLocaleTimeString()}
            </p>
          </div>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-4 h-4 text-muted-foreground shrink-0" />
        ) : (
          <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />
        )}
      </button>
      
      {isExpanded && (
        <div className="mt-3 ml-8 text-sm text-muted-foreground space-y-1">
          {renderContent(finding.content)}
          {codeBlockMatch && (
            <pre className="mt-3 p-3 rounded-lg bg-[#0d0d12] border border-border/50 overflow-x-auto">
              <code className="text-xs font-mono text-emerald-400">{codeBlockMatch[2]}</code>
            </pre>
          )}
        </div>
      )}
    </div>
  );
};

export const AIAnalysisPanel = ({ analysis, className }: AIAnalysisPanelProps) => {
  return (
    <div className={cn("flex flex-col h-full", className)}>
      {/* AI Status Ribbon */}
      <div className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-violet-500/10 to-blue-500/10 border-b border-border/50">
        <div className="relative">
          <Brain className="w-5 h-5 text-violet-400" />
          {analysis.status === 'analyzing' && (
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-violet-500 rounded-full animate-pulse" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-foreground">AI Analysis</p>
          <p className="text-xs text-muted-foreground truncate">
            {analysis.status === 'analyzing' && (
              <span className="inline-flex items-center gap-1.5">
                <span className="w-1 h-1 bg-violet-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-1 h-1 bg-violet-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-1 h-1 bg-violet-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                {analysis.statusMessage}
              </span>
            )}
            {analysis.status === 'complete' && 'Analysis complete'}
            {analysis.status === 'idle' && 'Waiting for logs...'}
          </p>
        </div>
      </div>

      {/* Findings */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {analysis.findings.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-6">
            <div className="w-16 h-16 rounded-full bg-muted/20 flex items-center justify-center mb-4">
              <Brain className="w-8 h-8 text-muted-foreground/50" />
            </div>
            <p className="text-sm text-muted-foreground">No analysis yet</p>
            <p className="text-xs text-muted-foreground/60 mt-1">
              AI will analyze logs as they stream in
            </p>
          </div>
        ) : (
          analysis.findings.map((finding) => (
            <FindingCard key={finding.id} finding={finding} />
          ))
        )}
      </div>
    </div>
  );
};
