"use client";

import { Facebook, Linkedin, Mail, Twitter } from "lucide-react";

import { Button } from "@/components/ui/button";

interface SocialShareProps {
  url: string;
  title: string;
}

export function SocialShare({ url, title }: SocialShareProps) {
  const fullUrl = `https://yourdomain.com${url}`;

  const shareOnTwitter = () => {
    window.open(
      `https://twitter.com/intent/tweet?url=${encodeURIComponent(
        fullUrl
      )}&text=${encodeURIComponent(title)}`,
      "_blank"
    );
  };

  const shareOnFacebook = () => {
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
        fullUrl
      )}`,
      "_blank"
    );
  };

  const shareOnLinkedIn = () => {
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
        fullUrl
      )}`,
      "_blank"
    );
  };

  const shareByEmail = () => {
    window.open(
      `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(
        `Check out this article: ${fullUrl}`
      )}`,
      "_blank"
    );
  };

  return (
    <div className="flex space-x-2">
      <Button variant="outline" size="icon" onClick={shareOnTwitter}>
        <Twitter className="h-4 w-4" />
        <span className="sr-only">Share on Twitter</span>
      </Button>
      <Button variant="outline" size="icon" onClick={shareOnFacebook}>
        <Facebook className="h-4 w-4" />
        <span className="sr-only">Share on Facebook</span>
      </Button>
      <Button variant="outline" size="icon" onClick={shareOnLinkedIn}>
        <Linkedin className="h-4 w-4" />
        <span className="sr-only">Share on LinkedIn</span>
      </Button>
      <Button variant="outline" size="icon" onClick={shareByEmail}>
        <Mail className="h-4 w-4" />
        <span className="sr-only">Share by Email</span>
      </Button>
    </div>
  );
}
