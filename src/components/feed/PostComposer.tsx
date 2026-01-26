'use client';

import { useState, useRef } from 'react';
import { useAuthStore } from '@/stores/authStore';
import Avatar from '@/components/ui/Avatar';
import { Image, Link2, Video, X, Loader2, ExternalLink } from 'lucide-react';
import { fetchLinkPreview, getDomain, LinkPreviewData } from '@/lib/linkPreview';

// Simple URL detection regex
const URL_REGEX = /(https?:\/\/[^\s]+)/gi;

export default function PostComposer() {
  const { user, userProfile } = useAuthStore();
  const [isExpanded, setIsExpanded] = useState(false);
  const [content, setContent] = useState('');
  const [linkPreview, setLinkPreview] = useState<LinkPreviewData | null>(null);
  const [isLoadingPreview, setIsLoadingPreview] = useState(false);
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [linkInput, setLinkInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const photoURL = userProfile?.photoURL || user?.photoURL || null;
  const displayName = userProfile?.name || user?.displayName || user?.email?.split('@')[0] || 'User';

  // Auto-detect URLs in content
  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setContent(newContent);

    // Auto-detect URLs
    if (!linkPreview && !isLoadingPreview) {
      const urls = newContent.match(URL_REGEX);
      if (urls && urls.length > 0) {
        handleFetchPreview(urls[0]);
      }
    }
  };

  // Fetch link preview using the API
  const handleFetchPreview = async (url: string) => {
    setIsLoadingPreview(true);
    try {
      const preview = await fetchLinkPreview(url);
      if (preview) {
        setLinkPreview(preview);
      } else {
        // Fallback preview
        setLinkPreview({
          url,
          title: `Link from ${getDomain(url)}`,
          siteName: getDomain(url),
        });
      }
    } catch (error) {
      console.error('Error fetching link preview:', error);
      // Set basic fallback
      setLinkPreview({
        url,
        title: `Link from ${getDomain(url)}`,
        siteName: getDomain(url),
      });
    } finally {
      setIsLoadingPreview(false);
    }
  };

  const handleAddLink = () => {
    if (linkInput.trim()) {
      handleFetchPreview(linkInput.trim());
      setShowLinkInput(false);
      setLinkInput('');
    }
  };

  const removeLinkPreview = () => {
    setLinkPreview(null);
  };

  const handleSubmit = async () => {
    if (!content.trim() && !linkPreview) return;

    // TODO: Implement post submission with link embed
    console.log('Submitting post:', { content, linkPreview });

    // Reset form
    setContent('');
    setLinkPreview(null);
    setIsExpanded(false);
  };

  if (!isExpanded) {
    return (
      <div className="px-4 pt-4 pb-4">
        <div className="backdrop-blur-lg bg-white/60 rounded-[32px] border border-gray-200 shadow-[0_8px_30px_rgba(0,0,0,0.04)] p-4">
          <div
            onClick={() => setIsExpanded(true)}
            className="flex items-center gap-3 cursor-pointer"
          >
            <Avatar src={photoURL} name={displayName} size="md" />
            <div className="flex-1 px-5 py-2.5 backdrop-blur-md bg-white/40 hover:bg-white/60 border border-gray-200/40 rounded-full text-gray-500 text-base font-normal transition-all duration-200">
              Share something with the community...
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 pt-4 pb-4">
      <div className="backdrop-blur-lg bg-white/60 rounded-[32px] border border-gray-200 shadow-[0_8px_30px_rgba(0,0,0,0.04)] p-4">
        {/* Header */}
        <div className="flex items-start gap-3 mb-3">
          <Avatar src={photoURL} name={displayName} size="md" />
          <div className="flex-1">
            <p className="font-semibold text-gray-900 text-base">{displayName}</p>
            <p className="text-xs text-gray-500">Posting publicly</p>
          </div>
          <button
            onClick={() => {
              setIsExpanded(false);
              setContent('');
              setLinkPreview(null);
            }}
            className="p-1.5 hover:bg-gray-900/5 rounded-full transition-all duration-200"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Text Input */}
        <textarea
          ref={textareaRef}
          value={content}
          onChange={handleContentChange}
          placeholder="Share a recipe, restaurant, or food discovery..."
          className="w-full min-h-[100px] resize-none bg-transparent text-gray-900 text-base placeholder:text-gray-400 focus:outline-none"
          autoFocus
        />

        {/* Link Input */}
        {showLinkInput && (
          <div className="flex items-center gap-2 mb-3 p-3 bg-gray-50/80 rounded-xl">
            <input
              type="url"
              value={linkInput}
              onChange={(e) => setLinkInput(e.target.value)}
              placeholder="Paste a link to a recipe, video, or article..."
              className="flex-1 bg-transparent text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none"
              autoFocus
              onKeyDown={(e) => e.key === 'Enter' && handleAddLink()}
            />
            <button
              onClick={handleAddLink}
              className="px-3 py-1.5 bg-gray-900 text-white text-xs font-semibold rounded-full hover:bg-gray-800 transition-colors"
            >
              Add
            </button>
            <button
              onClick={() => {
                setShowLinkInput(false);
                setLinkInput('');
              }}
              className="p-1 hover:bg-gray-200 rounded-full transition-colors"
            >
              <X size={16} className="text-gray-500" />
            </button>
          </div>
        )}

        {/* Loading Preview */}
        {isLoadingPreview && (
          <div className="flex items-center gap-2 mb-3 p-4 bg-gray-50/80 rounded-xl">
            <Loader2 size={16} className="text-gray-500 animate-spin" />
            <span className="text-sm text-gray-500">Fetching preview...</span>
          </div>
        )}

        {/* Link Preview */}
        {linkPreview && !isLoadingPreview && (
          <div className="mb-3 relative">
            <button
              onClick={removeLinkPreview}
              className="absolute -top-2 -right-2 z-10 w-6 h-6 bg-gray-900 text-white rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors shadow-lg"
            >
              <X size={14} />
            </button>
            <div className="rounded-xl border border-gray-200 overflow-hidden bg-white/80">
              <div className="flex flex-col sm:flex-row">
                <div className="flex-1 p-3">
                  <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 mb-1">
                    {linkPreview.title}
                  </h3>
                  {linkPreview.description && (
                    <p className="text-xs text-gray-600 line-clamp-2 mb-2">
                      {linkPreview.description}
                    </p>
                  )}
                  <div className="flex items-center gap-1.5">
                    {linkPreview.favicon && (
                      <img
                        src={linkPreview.favicon}
                        alt=""
                        className="w-4 h-4 rounded"
                        onError={(e) => (e.currentTarget.style.display = 'none')}
                      />
                    )}
                    <span className="text-xs text-gray-500">
                      {linkPreview.siteName || getDomain(linkPreview.url)}
                    </span>
                    <ExternalLink size={10} className="text-gray-400" />
                  </div>
                </div>
                {linkPreview.imageURL && (
                  <div className="sm:w-[120px] h-[90px] sm:h-auto flex-shrink-0 bg-gray-100">
                    <img
                      src={linkPreview.imageURL}
                      alt=""
                      className="w-full h-full object-cover"
                      onError={(e) => (e.currentTarget.style.display = 'none')}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-200/30">
          <div className="flex items-center gap-1">
            <button className="p-2 hover:bg-gray-900/5 rounded-full transition-all duration-200 text-gray-600 hover:text-gray-900">
              <Image size={20} strokeWidth={1.75} />
            </button>
            <button className="p-2 hover:bg-gray-900/5 rounded-full transition-all duration-200 text-gray-600 hover:text-gray-900">
              <Video size={20} strokeWidth={1.75} />
            </button>
            <button
              onClick={() => setShowLinkInput(true)}
              className={`p-2 hover:bg-gray-900/5 rounded-full transition-all duration-200 ${
                linkPreview ? 'text-gray-900 bg-gray-900/10' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Link2 size={20} strokeWidth={1.75} />
            </button>
          </div>

          <button
            onClick={handleSubmit}
            disabled={!content.trim() && !linkPreview}
            className="px-5 py-2 backdrop-blur-2xl bg-gray-900/95 hover:bg-gray-900 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-full font-semibold text-sm shadow-[0_4px_12px_rgba(0,0,0,0.15)] hover:shadow-[0_8px_20px_rgba(0,0,0,0.25)] transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
          >
            Post
          </button>
        </div>
      </div>
    </div>
  );
}
