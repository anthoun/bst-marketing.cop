import React, { useState, useEffect } from 'react';
import { db, supabase } from '../services/db';
import { BlogPost, Lead } from '../types';
import { Icons } from '../components/Icons';
import { Link, useNavigate } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Helmet } from 'react-helmet-async';

export const Admin: React.FC = () => {
   const navigate = useNavigate();
   const [isAuthenticated, setIsAuthenticated] = useState(false);
   const [authChecking, setAuthChecking] = useState(true);
   const [activeTab, setActiveTab] = useState<'posts' | 'leads'>('posts');
   const [posts, setPosts] = useState<BlogPost[]>([]);
   const [leads, setLeads] = useState<Lead[]>([]);
   const [isEditing, setIsEditing] = useState(false);
   const [currentPost, setCurrentPost] = useState<Partial<BlogPost>>({});
   const [isLoading, setIsLoading] = useState(false);

   // Login State
   const [loginEmail, setLoginEmail] = useState('');
   const [loginPass, setLoginPass] = useState('');
   const [loginError, setLoginError] = useState('');

   // Check for active session on load
   useEffect(() => {
      verifyUser();

      // Listen for auth changes
      const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
         if (session?.user) {
            verifyUser();
         } else {
            setIsAuthenticated(false);
            setAuthChecking(false);
         }
      });

      return () => {
         authListener.subscription.unsubscribe();
      };
   }, []);

   const verifyUser = async () => {
      setAuthChecking(true);
      const user = await db.getCurrentUser();
      if (user && user.role === 'admin') {
         setIsAuthenticated(true);
         loadData();
      } else {
         setIsAuthenticated(false);
      }
      setAuthChecking(false);
   };

   const loadData = async () => {
      setIsLoading(true);
      const p = await db.getPosts();
      const l = await db.getLeads();
      setPosts(p);
      setLeads(l);
      setIsLoading(false);
   };

   const handleLogin = async (e: React.FormEvent) => {
      e.preventDefault();
      setLoginError('');
      try {
         await db.login(loginEmail, loginPass);
         // verifyUser will be triggered by onAuthStateChange
      } catch (error: any) {
         setLoginError(error.message || 'Login failed');
      }
   };

   const handleLogout = async () => {
      await db.logout();
      setIsAuthenticated(false);
      navigate('/admin');
   };

   const handleSavePost = async () => {
      if (!currentPost.title || !currentPost.slug) return alert('Title and Slug required');

      setIsLoading(true);
      try {
         if (currentPost.id) {
            await db.updatePost(currentPost as BlogPost);
         } else {
            await db.createPost({
               title: currentPost.title!,
               slug: currentPost.slug!,
               excerpt: currentPost.excerpt || '',
               content: currentPost.content || '',
               category: currentPost.category || 'General',
               status: 'published',
               coverImage: currentPost.coverImage || `https://picsum.photos/800/400?random=${Math.random()}`,
               seoTitle: currentPost.seoTitle,
               seoDescription: currentPost.seoDescription,
               seoKeywords: currentPost.seoKeywords
            });
         }
         await loadData();
         setIsEditing(false);
         setCurrentPost({});
      } catch (error) {
         alert('Error saving post. Ensure you are logged in and have permissions.');
         console.error(error);
      }
      setIsLoading(false);
   };

   const handleDeletePost = async (id: string) => {
      if (confirm('Are you sure?')) {
         try {
            await db.deletePost(id);
            loadData();
         } catch (error) {
            alert('Error deleting post.');
         }
      }
   };



   if (authChecking) {
      return (
         <div className="min-h-screen flex items-center justify-center bg-background">
            <Icons.Spinner className="w-8 h-8 text-primary animate-spin" />
         </div>
      );
   }

   if (!isAuthenticated) {
      return (
         <div className="min-h-screen flex items-center justify-center bg-background">
            <form onSubmit={handleLogin} className="w-full max-w-md p-8 bg-surface border border-gray-200 shadow-xl rounded-xl">
               <div className="flex justify-center mb-6">
                  <Helmet>
                     <title>Admin Login | BST Marketing Experts</title>
                  </Helmet>
                  <div className="w-12 h-12 bg-primary rounded flex items-center justify-center transform -skew-x-12 shadow-lg shadow-primary/30">
                     <Icons.Zap className="w-6 h-6 text-white fill-current transform skew-x-12" />
                  </div>
               </div>
               <h2 className="text-2xl font-bold mb-6 text-center text-gray-900">BST Marketing Admin</h2>

               {loginError && (
                  <div className="bg-red-50 border border-red-200 text-red-600 text-sm p-3 rounded mb-4">
                     {loginError}
                  </div>
               )}

               <div className="space-y-4">
                  <div>
                     <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Email</label>
                     <input
                        type="email"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-gray-900"
                        required
                     />
                  </div>
                  <div>
                     <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Password</label>
                     <input
                        type="password"
                        value={loginPass}
                        onChange={(e) => setLoginPass(e.target.value)}
                        className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-gray-900"
                        required
                     />
                  </div>
                  <button type="submit" className="w-full bg-primary text-white font-bold py-3 rounded-lg hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20">
                     Login
                  </button>

                  <div className="text-center pt-4 border-t border-gray-100 mt-4">
                     <Link to="/" className="text-sm text-gray-500 hover:text-primary transition-colors">
                        &larr; Back to Site
                     </Link>
                  </div>
               </div>
            </form>
         </div>
      );
   }

   return (
      <div className="min-h-screen bg-background text-gray-900 flex flex-col">
         <Helmet>
            <title>Admin Dashboard | BST Marketing Experts</title>
         </Helmet>
         {/* Admin Header */}
         <header className="bg-surface border-b border-gray-200 py-4 px-8 flex justify-between items-center shadow-sm">
            <div className="flex items-center gap-3">
               <div className="bg-primary/10 p-2 rounded-lg"><Icons.Dashboard className="text-primary w-5 h-5" /></div>
               <h1 className="font-bold text-lg text-gray-900">BST Marketing</h1>
               <Link to="/" target="_blank" className="ml-4 text-xs bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-full text-gray-600 hover:text-gray-900 transition-colors flex items-center gap-1">
                  <Icons.Globe className="w-3 h-3" /> View Live Site
               </Link>
            </div>
            <div className="flex items-center gap-4">
               <div className="flex bg-gray-100 p-1 rounded-lg">
                  <button
                     onClick={() => setActiveTab('posts')}
                     className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'posts' ? 'bg-white text-primary shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
                  >
                     Blog Posts
                  </button>
                  <button
                     onClick={() => setActiveTab('leads')}
                     className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'leads' ? 'bg-white text-primary shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
                  >
                     Leads
                  </button>
               </div>
               <div className="h-6 w-px bg-gray-200 mx-2"></div>
               <button onClick={handleLogout} className="flex items-center gap-2 text-red-500 hover:text-red-700 transition-colors px-3 py-2 rounded-md text-sm font-medium">
                  <Icons.LogOut className="w-4 h-4" /> Logout
               </button>
            </div>
         </header>

         <main className="flex-1 p-8 max-w-7xl mx-auto w-full">
            {activeTab === 'posts' ? (
               <div>
                  <div className="flex justify-between items-center mb-8">
                     <h2 className="text-2xl font-bold text-gray-900">Manage Content</h2>
                     <button
                        onClick={() => { setCurrentPost({}); setIsEditing(true); }}
                        className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-bold shadow-lg shadow-primary/20"
                     >
                        <Icons.Plus className="w-4 h-4" /> New Post
                     </button>
                  </div>

                  {isEditing ? (
                     <div className="bg-surface border border-gray-200 rounded-xl p-6 animate-fade-in shadow-xl">
                        <div className="flex justify-between mb-6 border-b border-gray-100 pb-4">
                           <h3 className="text-xl font-bold text-gray-900">{currentPost.id ? 'Edit Post' : 'Create Post'}</h3>
                           <button onClick={() => setIsEditing(false)}><Icons.X className="w-5 h-5 text-gray-400 hover:text-gray-600" /></button>
                        </div>

                        <div className="space-y-6">
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div className="space-y-2">
                                 <label className="text-xs font-bold text-gray-500 uppercase">Title</label>
                                 <input
                                    placeholder="Post Title"
                                    className="w-full bg-white border border-gray-200 rounded-lg p-3 focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none text-gray-900"
                                    value={currentPost.title || ''}
                                    onChange={(e) => setCurrentPost({ ...currentPost, title: e.target.value })}
                                 />
                              </div>
                              <div className="space-y-2">
                                 <label className="text-xs font-bold text-gray-500 uppercase">Slug</label>
                                 <input
                                    placeholder="URL Slug (e.g. my-post-title)"
                                    className="w-full bg-white border border-gray-200 rounded-lg p-3 focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none text-gray-900"
                                    value={currentPost.slug || ''}
                                    onChange={(e) => setCurrentPost({ ...currentPost, slug: e.target.value })}
                                 />
                              </div>
                           </div>

                           <div className="space-y-2">
                              <label className="text-xs font-bold text-gray-500 uppercase">Excerpt</label>
                              <input
                                 placeholder="Short Excerpt"
                                 className="w-full bg-white border border-gray-200 rounded-lg p-3 focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none text-gray-900"
                                 value={currentPost.excerpt || ''}
                                 onChange={(e) => setCurrentPost({ ...currentPost, excerpt: e.target.value })}
                              />
                           </div>

                           <div className="space-y-2">
                              <label className="text-xs font-bold text-gray-500 uppercase">Cover Image URL</label>
                              <input
                                 placeholder="https://..."
                                 className="w-full bg-white border border-gray-200 rounded-lg p-3 focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none text-gray-900"
                                 value={currentPost.coverImage || ''}
                                 onChange={(e) => setCurrentPost({ ...currentPost, coverImage: e.target.value })}
                              />
                           </div>

                           <div className="space-y-2">
                              <label className="text-xs font-bold text-gray-500 uppercase">Category</label>
                              <input
                                 placeholder="e.g. SEO, Marketing, News"
                                 className="w-full bg-white border border-gray-200 rounded-lg p-3 focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none text-gray-900"
                                 value={currentPost.category || ''}
                                 onChange={(e) => setCurrentPost({ ...currentPost, category: e.target.value })}
                              />
                           </div>

                           <div className="space-y-2">
                              <label className="text-xs font-bold text-gray-500 uppercase">Content</label>
                              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden focus-within:border-primary focus-within:ring-1 focus-within:ring-primary">
                                 <textarea
                                    className="w-full h-64 p-4 text-gray-900 focus:outline-none"
                                    value={currentPost.content || ''}
                                    onChange={(e) => setCurrentPost({ ...currentPost, content: e.target.value })}
                                    placeholder="Write your post content here..."
                                 />
                              </div>
                           </div>

                           <div className="border-t border-gray-100 pt-6 mt-6">
                              <h4 className="text-lg font-bold mb-4 flex items-center gap-2 text-gray-900">
                                 <Icons.Search className="w-5 h-5 text-primary" />
                                 SEO Settings
                              </h4>
                              <div className="space-y-4">
                                 <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase">SEO Title (Meta Title)</label>
                                    <input
                                       placeholder="Custom title for search engines (defaults to post title)"
                                       className="w-full bg-white border border-gray-200 rounded-lg p-3 focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none text-gray-900"
                                       value={currentPost.seoTitle || ''}
                                       onChange={(e) => setCurrentPost({ ...currentPost, seoTitle: e.target.value })}
                                    />
                                 </div>
                                 <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase">Meta Description</label>
                                    <textarea
                                       placeholder="Brief summary for search results (defaults to excerpt)"
                                       className="w-full bg-white border border-gray-200 rounded-lg p-3 focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none text-gray-900 h-24 resize-none"
                                       value={currentPost.seoDescription || ''}
                                       onChange={(e) => setCurrentPost({ ...currentPost, seoDescription: e.target.value })}
                                    />
                                    <div className="text-right text-xs text-gray-400">
                                       {(currentPost.seoDescription || '').length}/160 recommended
                                    </div>
                                 </div>
                                 <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase">Keywords</label>
                                    <input
                                       placeholder="Comma separated keywords (e.g. marketing, seo, growth)"
                                       className="w-full bg-white border border-gray-200 rounded-lg p-3 focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none text-gray-900"
                                       value={currentPost.seoKeywords || ''}
                                       onChange={(e) => setCurrentPost({ ...currentPost, seoKeywords: e.target.value })}
                                    />
                                 </div>
                              </div>
                           </div>

                           <div className="flex justify-end gap-4 pt-4 border-t border-gray-100">
                              <button onClick={() => setIsEditing(false)} className="text-gray-500 hover:text-gray-900 text-sm font-medium px-4 py-2">Cancel</button>
                              <button onClick={handleSavePost} className="bg-primary text-white px-6 py-2 rounded-lg font-bold hover:bg-primary/90 transition-colors shadow-md">
                                 {isLoading ? 'Saving...' : 'Save Post'}
                              </button>
                           </div>
                        </div>
                     </div>
                  ) : (
                     <div className="grid gap-4">
                        {posts.length === 0 && !isLoading && (
                           <div className="text-center py-20 text-gray-500">No posts found in database.</div>
                        )}
                        {posts.map(post => (
                           <div key={post.id} className="bg-surface border border-gray-200 p-6 rounded-xl flex items-center justify-between group hover:border-primary/50 hover:shadow-md transition-all">
                              <div className="flex items-start gap-4">
                                 <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden border border-gray-200 shrink-0">
                                    {post.coverImage ? (
                                       <img src={post.coverImage} alt="" className="w-full h-full object-cover" />
                                    ) : (
                                       <div className="w-full h-full flex items-center justify-center text-gray-400"><Icons.Post className="w-6 h-6" /></div>
                                    )}
                                 </div>
                                 <div>
                                    <h3 className="font-bold text-lg text-gray-900 mb-1">{post.title}</h3>
                                    <div className="flex items-center gap-3 text-sm text-gray-500">
                                       <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase ${post.status === 'published' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'}`}>{post.status}</span>
                                       <span className="text-gray-400">/</span>
                                       <span>{post.slug}</span>
                                       <span className="text-gray-400 hidden md:inline">•</span>
                                       <span className="hidden md:inline">{new Date(post.publishedAt).toLocaleDateString()}</span>
                                    </div>
                                 </div>
                              </div>
                              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                 <button onClick={() => { setCurrentPost(post); setIsEditing(true); }} className="p-2 hover:bg-gray-100 rounded-lg text-blue-500 transition-colors"><Icons.Edit className="w-5 h-5" /></button>
                                 <button onClick={() => handleDeletePost(post.id)} className="p-2 hover:bg-gray-100 rounded-lg text-red-500 transition-colors"><Icons.Trash className="w-5 h-5" /></button>
                              </div>
                           </div>
                        ))}
                     </div>
                  )}
               </div>
            ) : (
               <div>
                  <h2 className="text-2xl font-bold mb-8 text-gray-900">Lead Submissions</h2>

                  <div className="bg-surface border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                     <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-gray-600">
                           <thead className="text-xs uppercase bg-gray-50 text-gray-500 font-bold tracking-wider">
                              <tr>
                                 <th className="px-6 py-4">Date</th>
                                 <th className="px-6 py-4">Type</th>
                                 <th className="px-6 py-4">Name</th>
                                 <th className="px-6 py-4">Email</th>
                                 <th className="px-6 py-4">Phone</th>
                                 <th className="px-6 py-4">Message / Challenge</th>
                              </tr>
                           </thead>
                           <tbody className="divide-y divide-gray-100">
                              {leads.map((lead) => (
                                 <tr key={lead.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">{new Date(lead.createdAt).toLocaleDateString()}</td>
                                    <td className="px-6 py-4">
                                       <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${lead.type === 'newsletter' ? 'bg-purple-100 text-purple-600' : 'bg-orange-100 text-orange-600'}`}>
                                          {lead.type}
                                       </span>
                                    </td>
                                    <td className="px-6 py-4 font-medium text-gray-900">{lead.name || '-'}</td>
                                    <td className="px-6 py-4 text-gray-600">{lead.email}</td>
                                    <td className="px-6 py-4 font-mono text-xs">{lead.phone || '-'}</td>
                                    <td className="px-6 py-4 max-w-xs truncate" title={lead.message}>{lead.message || '-'}</td>
                                 </tr>
                              ))}
                              {leads.length === 0 && !isLoading && (
                                 <tr><td colSpan={6} className="text-center py-12">No leads received yet.</td></tr>
                              )}
                           </tbody>
                        </table>
                     </div>
                  </div>
               </div>
            )}
         </main>
      </div>
   );
};