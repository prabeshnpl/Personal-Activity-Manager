import { forwardRef, useEffect, useRef, useState } from "react";

const RichTextEditor = forwardRef<HTMLDivElement>(
  (
    {
      value,
      onChange,
      placeholder = "Enter text...",
      className = "mb-16 sm:mb-12",
      heightClass,
    },
    ref
  ) => {
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const [isInitialized, setIsInitialized] = useState(false);
    const [scriptsLoaded, setScriptsLoaded] = useState(false);
    const isInitializingRef = useRef(false);

    const cleanEmptyContent = (content) => {
      if (!content) return "";
      
      const parser = new DOMParser();
      const doc = parser.parseFromString(content, 'text/html');
      const textOnly = doc.body.textContent?.trim() ?? '';

      const basicEmptyHtml = content
        .replace(/\s/g, '')
        .replace(/<p><br><\/p>|<p><\/p>|<div><br><\/div>|<div><\/div>|<br>|<br\/>/g, '');

      if (!textOnly && !basicEmptyHtml) {
        return "";
      }
      
      return content;
    };

    // Function to initialize Summernote
    const initializeSummernote = () => {
      if (!textareaRef.current || !window.$ || isInitializingRef.current) {
        return;
      }

      // Check if already initialized and destroy first
      if (window.$(textareaRef.current).data('summernote')) {
        window.$(textareaRef.current).summernote('destroy');
      }

      isInitializingRef.current = true;

      try {
        window.$(textareaRef.current).summernote({
          height: 120,
          placeholder: placeholder,
          width: '100%',
          disableResizeEditor: false,
          toolbar: [
            ['style', ['style']],
            ['font', ['bold', 'italic', 'underline', 'strikethrough']],
            ['fontsize', ['fontsize']],
            ['color', ['color']],
            ['para', ['ul', 'ol', 'paragraph']],
            ['table', ['table']],
            ['insert', ['link', 'picture']],
            ['view', ['fullscreen', 'codeview']]
          ],
          table: {
            className: 'summernote-table'
          },
          callbacks: {
            onInit: function() {
              setIsInitialized(true);
              isInitializingRef.current = false;
              
              // Set initial value after initialization
              if (value) {
                window.$(textareaRef.current).summernote('code', value);
              }
            },
            onChange: function (contents) {
              const cleanedContents = cleanEmptyContent(contents);
              onChange(cleanedContents);
            },
            onPaste: function (e) {
              const pastedData = (e.originalEvent || e).clipboardData.getData('text/html');

              if (pastedData) {
                e.preventDefault();
                const tempEl = document.createElement('div');
                tempEl.innerHTML = pastedData;

                const sanitizeElement = (el) => {
                  const elements = el.querySelectorAll('*');
                  elements.forEach((element) => {
                    element.removeAttribute('style');
                    element.removeAttribute('width');
                    element.removeAttribute('height');
                    element.removeAttribute('min-width');
                    element.removeAttribute('max-width');

                    if (element.tagName === 'SCRIPT') {
                      element.remove();
                    }

                    if (element.tagName === 'TABLE') {
                      element.style.width = '100%';
                      element.style.maxWidth = '100%';
                    }

                    if (element.tagName === 'TD' || element.tagName === 'TH') {
                      element.style.wordWrap = 'break-word';
                      element.style.overflowWrap = 'break-word';
                      element.style.minWidth = '80px';
                      element.style.maxWidth = '300px';
                    }
                  });
                };

                sanitizeElement(tempEl);
                window.$(textareaRef.current).summernote('pasteHTML', tempEl.innerHTML);

                const finalContent = window.$(textareaRef.current).summernote('code');
                const cleanedContent = cleanEmptyContent(finalContent);
                onChange(cleanedContent);
              } else {
                const plainText = (e.originalEvent || e).clipboardData.getData('text/plain');
                if (plainText) {
                  e.preventDefault();
                  const wrappedText = plainText.replace(/(\S{50})/g, '$1 ');
                  document.execCommand('insertText', false, wrappedText);
                  const finalContent = window.$(textareaRef.current).summernote('code');
                  const cleanedContent = cleanEmptyContent(finalContent);
                  onChange(cleanedContent);
                }
              }
            }
          }
        });
      } catch (error) {
        console.error('Error initializing Summernote:', error);
        isInitializingRef.current = false;
      }
    };

    // Load scripts effect
    useEffect(() => {
      const loadScripts = async () => {
        
        try {
          // Load jQuery
          if (!window.$) {
            const jqueryScript = document.createElement('script');
            jqueryScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js';
            document.head.appendChild(jqueryScript);

            await new Promise((resolve, reject) => {
              jqueryScript.onload = resolve;
              jqueryScript.onerror = reject;
            });
          }

          // Load Summernote CSS
          if (!document.querySelector('link[href*="summernote"]')) {
            const summernoteCSS = document.createElement('link');
            summernoteCSS.rel = 'stylesheet';
            summernoteCSS.href = 'https://cdnjs.cloudflare.com/ajax/libs/summernote/0.8.20/summernote-lite.min.css';
            document.head.appendChild(summernoteCSS);
          }

          // Load Summernote JS
          if (!window.$.summernote) {
            const summernoteScript = document.createElement('script');
            summernoteScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/summernote/0.8.20/summernote-lite.min.js';
            document.head.appendChild(summernoteScript);

            await new Promise((resolve, reject) => {
              summernoteScript.onload = resolve;
              summernoteScript.onerror = reject;
            });
          }

          setScriptsLoaded(true);
        } catch (error) {
          console.error('Error loading scripts:', error);
        }
      };

      loadScripts();
    }, []); // Only run once

    // Initialize Summernote when scripts are loaded and textarea is ready
    useEffect(() => {
      if (scriptsLoaded && textareaRef.current && !isInitialized && !isInitializingRef.current) {
        // Small delay to ensure DOM is fully ready
        const timer = setTimeout(() => {
          initializeSummernote();
        }, 100);

        return () => clearTimeout(timer);
      }
    }, [scriptsLoaded, placeholder]); // Re-run when scripts load or placeholder changes

    // Handle value changes from parent
    useEffect(() => {
      if (isInitialized && textareaRef.current && window.$) {
        const currentContent = window.$(textareaRef.current).summernote('code');
        const cleanedCurrentContent = cleanEmptyContent(currentContent);
        const cleanedPropValue = cleanEmptyContent(value);
        
        if (cleanedCurrentContent !== cleanedPropValue) {
          window.$(textareaRef.current).summernote('code', value);
        }
      }
    }, [value, isInitialized]);

    // Cleanup effect
    useEffect(() => {
      return () => {
        if (textareaRef.current && window.$ && window.$(textareaRef.current).data('summernote')) {
          window.$(textareaRef.current).summernote('destroy');
        }
        setIsInitialized(false);
        isInitializingRef.current = false;
      };
    }, []);

    return (
      <div ref={ref} className={`bg-white ${className}`}>
        <style>{`
          .note-editor {
            width: 100% !important;
            max-width: 100% !important;
            overflow-x: hidden !important;
          }
          
          .note-editing-area {
            width: 100% !important;
            max-width: 100% !important;
            overflow-x: hidden !important;
          }
          
          .note-editable {
            width: 100% !important;
            max-width: 100% !important;
            word-wrap: break-word !important;
            word-break: break-word !important;
            white-space: pre-wrap !important;
            overflow-x: hidden !important;
            overflow-y: auto !important;
          }

          .note-editable * {
            max-width: 100% !important;
            word-wrap: break-word !important;
            word-break: break-all !important;
          }

          .note-editable p,
          .note-editable div,
          .note-editable span {
            max-width: 100% !important;
            word-wrap: break-word !important;
            overflow-wrap: break-word !important;
          }

          .note-editable [style*="width"] {
            width: auto !important;
            max-width: 100% !important;
          }

          .note-editor table,
          .summernote-table {
            border-collapse: collapse !important;
            width: 100% !important;
            max-width: 100% !important;
            table-layout: auto !important;
            margin: 10px 0 !important;
            border: 1px solid #dee2e6 !important;
          }
          
          .note-editor table td,
          .note-editor table th,
          .summernote-table td,
          .summernote-table th {
            border: 1px solid #dee2e6 !important;
            padding: 8px 12px !important;
            text-align: left !important;
            vertical-align: top !important;
            word-wrap: break-word !important;
            overflow-wrap: break-word !important;
            min-width: 80px !important;
            max-width: 300px !important;
          }
          
          .note-editor table th,
          .summernote-table th {
            background-color: #f8f9fa !important;
            font-weight: bold !important;
          }
          
          .text-sm table,
          .md\\:text-base table {
            border-collapse: collapse !important;
            width: 100% !important;
            max-width: 100% !important;
            table-layout: auto !important;
            margin: 10px 0 !important;
            border: 1px solid #dee2e6 !important;
          }
          
          .text-sm table td,
          .text-sm table th,
          .md\\:text-base table td,
          .md\\:text-base table th {
            border: 1px solid #dee2e6 !important;
            padding: 8px 12px !important;
            text-align: left !important;
            vertical-align: top !important;
            word-wrap: break-word !important;
            overflow-wrap: break-word !important;
            min-width: 80px !important;
            max-width: 300px !important;
          }
          
          .text-sm table th,
          .md\\:text-base table th {
            background-color: #f8f9fa !important;
            font-weight: bold !important;
          }
          
          .text-sm table tr:nth-child(even),
          .md\\:text-base table tr:nth-child(even) {
            background-color: #f8f9fa !important;
          }

          .note-editable img {
            max-width: 100% !important;
            height: auto !important;
          }

          .note-editable pre,
          .note-editable code {
            white-space: pre-wrap !important;
            word-wrap: break-word !important;
            overflow-x: auto !important;
            max-width: 100% !important;
          }
        `}</style>

        <textarea
          ref={textareaRef}
          className={`w-full ${heightClass}`}
          defaultValue={value}
        />
        
        {process.env.NODE_ENV === 'development' && (
          <div style={{fontSize: '10px', color: '#666', marginTop: '5px'}}>
            Scripts: {scriptsLoaded ? '✓' : '⏳'} | 
            Initialized: {isInitialized ? '✓' : '⏳'} | 
            Initializing: {isInitializingRef.current ? '⏳' : '✗'}
          </div>
        )}
      </div>
    );
  }
);

// RichTextEditor.displayName = "RichTextEditor";

export default RichTextEditor;