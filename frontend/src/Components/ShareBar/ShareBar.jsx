import React, { useState } from "react";

import Facebook from "../../assets/images/Social/Facebook.svg?react";
import Instagram from "../../assets/images/Social/Instagram.svg?react";
import Telegram from "../../assets/images/Social/Telegram.svg?react";
import X from "../../assets/images/Social/X.svg?react";
import Pinterest from "../../assets/images/Social/Pinterest.svg?react";
import LinkedIn from "../../assets/images/Social/LinkedIn.svg?react";
import Swal from "sweetalert2";

export const ShareBar = ({ title, url, image, description }) => {
  const [isCopied, setIsCopied] = useState(false);

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      url
    )}&quote=${encodeURIComponent(title)}`,
    x: `https://twitter.com/intent/tweet?url=${encodeURIComponent(
      url
    )}&text=${encodeURIComponent(title)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
      url
    )}&title=${encodeURIComponent(title)}&summary=${encodeURIComponent(
      description
    )}`,
    pinterest: `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(
      url
    )}&media=${encodeURIComponent(image)}&description=${encodeURIComponent(
      title
    )}`,
    reddit: `https://www.reddit.com/submit?url=${encodeURIComponent(
      url
    )}&title=${encodeURIComponent(title)}`,
    telegram: `https://t.me/share/url?url=${encodeURIComponent(
      url
    )}&text=${encodeURIComponent(title)}`,
  };

  const handleInstagramShare = () => {
    Swal.fire({
      title: "Instagram",
      text: "Instagram no permite compartir contenido directamente, copia el link para compartir desde la aplicación",
      icon: "info",
      timer: "4000",
      showConfirmButton: false,
      position: "center",
    });
  };

  const copyToClipboard = () => {
    navigator.clipboard
      .writeText(url)
      .then(() => {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
      });
  };

  const shareModal = (url) => {
    window.open(url, "_blank", "width=600,height=400");
  };

  return (
    <div className="flex flex-col items-end mt-4">
      {/* <h3 className="text-lg font-semibold">Compartir</h3> */}

      <div className="flex flex-wrap gap-1">
        <button
          onClick={() => shareModal(shareLinks.facebook)}
          className="transition-transform hover:scale-110"
        >
          <Facebook width="40" height="40" />
        </button>

        <button
          onClick={() => shareModal(shareLinks.x)}
          className="transition-transform hover:scale-110"
        >
          <X width="40" height="40" />
        </button>

        <button
          onClick={() => shareModal(shareLinks.linkedin)}
          className="transition-transform hover:scale-110"
        >
          <LinkedIn width="40" height="40" />
        </button>

        <button
          onClick={() => shareModal(shareLinks.pinterest)}
          className="transition-transform hover:scale-110"
        >
          <Pinterest width="40" height="40"/>
        </button>
        <button
          onClick={() => shareModal(shareLinks.telegram)}
          className="transition-transform hover:scale-110"
        >
          <Telegram width="40" height="40" />
        </button>

        <button
          onClick={handleInstagramShare}
          className="transition-transform hover:scale-110"
        >
          <Instagram width="40" height="40" />
        </button>

        <button
          onClick={copyToClipboard}
          className="px-4 py-2 font-semibold bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
        >
          {isCopied ? "link copiado!" : "Copiar Link"}
        </button>
      </div>
    </div>
  );
};
