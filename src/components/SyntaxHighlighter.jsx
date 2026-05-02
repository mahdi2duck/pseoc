import React from 'react';
import Prism from 'prismjs';
import 'prismjs/themes/prism-tomorrow.css';

const SyntaxHighlighter = ({ children, language }) => {
  // Use Prism to highlight the code
  const highlighted = Prism.highlight(children, Prism.languages[language] || Prism.languages.markup, language);

  return (
    <pre>
      <code 
        className={`language-${language}`} 
        dangerouslySetInnerHTML={{ __html: highlighted }}
      />
    </pre>
  );
};

export default SyntaxHighlighter;