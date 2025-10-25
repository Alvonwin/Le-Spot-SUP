'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-provider';
import { useTranslation } from '@/context/language-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, ThumbsUp, Send, Users2, TrendingUp } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface Post {
  id: string;
  userId: string;
  userEmail: string;
  userName: string;
  userPhoto?: string;
  content: string;
  category: 'question' | 'conseil' | 'partage' | 'discussion';
  likes: number;
  likedBy: string[];
  replies: Reply[];
  createdAt: string;
}

interface Reply {
  id: string;
  userId: string;
  userEmail: string;
  userName: string;
  content: string;
  createdAt: string;
}

const CATEGORIES = {
  question: { label: 'Question', color: 'bg-blue-500' },
  conseil: { label: 'Conseil', color: 'bg-green-500' },
  partage: { label: 'Partage', color: 'bg-purple-500' },
  discussion: { label: 'Discussion', color: 'bg-orange-500' },
};

export default function CommunityPage() {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPost, setNewPost] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Post['category']>('discussion');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = () => {
    const saved = localStorage.getItem('sup_community_posts');
    if (saved) {
      setPosts(JSON.parse(saved));
    }
  };

  const savePosts = (updatedPosts: Post[]) => {
    localStorage.setItem('sup_community_posts', JSON.stringify(updatedPosts));
    setPosts(updatedPosts);
  };

  const handleCreatePost = () => {
    if (!user || !newPost.trim()) return;

    const post: Post = {
      id: Date.now().toString(),
      userId: user.uid,
      userEmail: user.email || '',
      userName: user.displayName || user.email?.split('@')[0] || 'Utilisateur',
      userPhoto: user.photoURL || undefined,
      content: newPost,
      category: selectedCategory,
      likes: 0,
      likedBy: [],
      replies: [],
      createdAt: new Date().toISOString(),
    };

    savePosts([post, ...posts]);
    setNewPost('');
  };

  const handleLike = (postId: string) => {
    if (!user) return;

    const updatedPosts = posts.map(post => {
      if (post.id === postId) {
        const hasLiked = post.likedBy.includes(user.uid);
        return {
          ...post,
          likes: hasLiked ? post.likes - 1 : post.likes + 1,
          likedBy: hasLiked
            ? post.likedBy.filter(id => id !== user.uid)
            : [...post.likedBy, user.uid],
        };
      }
      return post;
    });

    savePosts(updatedPosts);
  };

  const handleReply = (postId: string) => {
    if (!user || !replyContent.trim()) return;

    const reply: Reply = {
      id: Date.now().toString(),
      userId: user.uid,
      userEmail: user.email || '',
      userName: user.displayName || user.email?.split('@')[0] || 'Utilisateur',
      content: replyContent,
      createdAt: new Date().toISOString(),
    };

    const updatedPosts = posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          replies: [...post.replies, reply],
        };
      }
      return post;
    });

    savePosts(updatedPosts);
    setReplyContent('');
    setReplyingTo(null);
  };

  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Users2 className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Communauté SUP</h1>
        </div>
        <p className="text-muted-foreground">
          Partagez vos expériences, posez vos questions et connectez-vous avec d'autres passionnés de paddle
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Publications</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{posts.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Réponses</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {posts.reduce((acc, post) => acc + post.replies.length, 0)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">J'aime</CardTitle>
            <ThumbsUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {posts.reduce((acc, post) => acc + post.likes, 0)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Create Post */}
      {user && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Nouvelle publication</CardTitle>
            <CardDescription>Partagez avec la communauté</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              {Object.entries(CATEGORIES).map(([key, cat]) => (
                <Button
                  key={key}
                  variant={selectedCategory === key ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory(key as Post['category'])}
                >
                  {cat.label}
                </Button>
              ))}
            </div>
            <Textarea
              placeholder="Que voulez-vous partager ?"
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              rows={4}
            />
            <Button onClick={handleCreatePost} className="w-full">
              <Send className="h-4 w-4 mr-2" />
              Publier
            </Button>
          </CardContent>
        </Card>
      )}

      {!user && (
        <Card className="mb-8">
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground mb-4">
              Connectez-vous pour participer aux discussions
            </p>
            <Button onClick={() => window.location.href = '/login'}>
              Se connecter
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Posts Feed */}
      <div className="space-y-4">
        {posts.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center text-muted-foreground">
              Aucune publication pour le moment. Soyez le premier à partager !
            </CardContent>
          </Card>
        ) : (
          posts.map((post) => (
            <Card key={post.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={post.userPhoto} />
                      <AvatarFallback>
                        {post.userName.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold">{post.userName}</p>
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(post.createdAt), "d MMMM yyyy 'à' HH:mm", { locale: fr })}
                      </p>
                    </div>
                  </div>
                  <Badge className={CATEGORIES[post.category].color}>
                    {CATEGORIES[post.category].label}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="whitespace-pre-wrap">{post.content}</p>

                {/* Actions */}
                <div className="flex items-center gap-4 pt-2 border-t">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleLike(post.id)}
                    className={post.likedBy.includes(user?.uid || '') ? 'text-primary' : ''}
                  >
                    <ThumbsUp className="h-4 w-4 mr-1" />
                    {post.likes}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setReplyingTo(replyingTo === post.id ? null : post.id)}
                  >
                    <MessageSquare className="h-4 w-4 mr-1" />
                    {post.replies.length}
                  </Button>
                </div>

                {/* Replies */}
                {post.replies.length > 0 && (
                  <div className="space-y-3 pl-4 border-l-2">
                    {post.replies.map((reply) => (
                      <div key={reply.id} className="space-y-1">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-semibold">{reply.userName}</p>
                          <p className="text-xs text-muted-foreground">
                            {format(new Date(reply.createdAt), "d MMM HH:mm", { locale: fr })}
                          </p>
                        </div>
                        <p className="text-sm">{reply.content}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Reply Form */}
                {replyingTo === post.id && user && (
                  <div className="space-y-2 pl-4 border-l-2">
                    <Input
                      placeholder="Votre réponse..."
                      value={replyContent}
                      onChange={(e) => setReplyContent(e.target.value)}
                    />
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => handleReply(post.id)}>
                        Répondre
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          setReplyingTo(null);
                          setReplyContent('');
                        }}
                      >
                        Annuler
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
