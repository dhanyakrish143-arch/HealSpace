import React, { useState } from "react";
import ChatWindow from "./chat/ChatWindow";

export default function FloatingChatWidget() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div style={{ position: "fixed", bottom: "24px", right: "24px", zIndex: 999999 }}>
      {isOpen && (
        <div style={{
          position: "fixed",
          bottom: "95px",
          right: "24px",
          width: "380px",
          maxHeight: "560px",
          backgroundColor: "#ffffff",
          borderRadius: "24px",
          boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
          border: "1px solid #DFD5C4",
          overflow: "hidden",
          zIndex: 999999
        }}>
          <div style={{ position: "relative" }}>
            <button
              onClick={() => setIsOpen(false)}
              style={{
                position: "absolute",
                top: "14px",
                right: "14px",
                background: "rgba(0,0,0,0.4)",
                color: "#ffffff",
                border: "none",
                borderRadius: "50%",
                width: "28px",
                height: "28px",
                cursor: "pointer",
                fontWeight: "bold",
                zIndex: 10
              }}
            >
              ✕
            </button>
            <ChatWindow
              roomId="session-ananya-sharma"
              senderName="Client Visitor"
              role="client"
            />
          </div>
        </div>
      )}

      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: "60px",
          height: "60px",
          borderRadius: "50%",
          backgroundColor: "#0F382A",
          color: "#ffffff",
          border: "3px solid #34D399",
          boxShadow: "0 10px 25px rgba(15, 56, 42, 0.5)",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "26px"
        }}
        title="Open Live Chat"
      >
        {isOpen ? "✕" : "💬"}
      </button>
    </div>
  );
}
