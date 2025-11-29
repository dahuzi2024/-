import React from 'react';
import ReactMarkdown from 'react-markdown';
import { SectionContent } from '../types';

interface ArticleProps {
  data: SectionContent;
  align: 'left' | 'right';
}

const Article: React.FC<ArticleProps> = ({ data, align }) => {
  const Icon = data.icon;

  return (
    <div id={data.id} className="py-16 md:py-24 border-t border-white/5 relative overflow-hidden group">
      {/* Ambient Glow */}
      <div className={`absolute top-0 ${align === 'left' ? 'left-0' : 'right-0'} w-full md:w-1/3 h-full bg-gradient-to-b from-${data.color.split('-')[1]}-500/5 to-transparent blur-3xl -z-10`} />

      <div className="max-w-5xl mx-auto px-6">
        <div className="flex flex-col md:flex-row gap-8 md:gap-12">
          
          {/* Header Column */}
          <div className="md:w-1/3 flex flex-col gap-4 md:gap-6 md:sticky md:top-24 md:h-fit">
            <div className={`p-4 rounded-2xl w-fit bg-surface border border-white/10 ${data.color}`}>
              <Icon size={32} className="md:w-12 md:h-12" />
            </div>
            <div>
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-2">{data.title}</h2>
              <p className={`text-lg md:text-xl font-mono ${data.color}`}>{data.subtitle}</p>
            </div>
            <div className="bg-surface p-4 md:p-6 rounded-lg border-l-2 border-white/20">
              <p className="text-muted italic text-sm md:text-base">"{data.summary}"</p>
            </div>
          </div>

          {/* Content Column */}
          <div className="md:w-2/3 prose prose-invert prose-lg max-w-none">
            <div className="space-y-6 text-gray-300 leading-relaxed text-base md:text-lg">
              <ReactMarkdown 
                components={{
                  h3: ({node, ...props}) => <h3 className={`text-xl md:text-2xl font-bold mt-8 md:mt-12 mb-4 ${data.color}`} {...props} />,
                  strong: ({node, ...props}) => <strong className="text-white font-semibold" {...props} />,
                  ul: ({node, ...props}) => <ul className="list-disc pl-5 md:pl-6 space-y-2 my-4" {...props} />,
                  li: ({node, ...props}) => <li className="text-gray-400 pl-1" {...props} />
                }}
              >
                {data.content}
              </ReactMarkdown>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Article;