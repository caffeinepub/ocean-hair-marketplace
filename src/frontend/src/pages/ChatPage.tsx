import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Principal } from "@icp-sdk/core/principal";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { ArrowLeft, Loader2, MessageCircle, Send } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { BottomNav } from "../components/BottomNav";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useGetMessages,
  useGetProduct,
  useSendMessage,
} from "../hooks/useQueries";

export function ChatPage() {
  const search = useSearch({ from: "/chat" });
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const [text, setText] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const messagesLength = useRef(0);

  const productId = (search as any).productId
    ? BigInt((search as any).productId as string)
    : null;
  const sellerIdStr = (search as any).sellerId as string | undefined;

  const { data: messages = [], isLoading } = useGetMessages(productId);
  const { data: product } = useGetProduct(productId);
  const sendMessage = useSendMessage();

  const myPrincipal = identity?.getPrincipal().toString();

  useEffect(() => {
    if (messages.length !== messagesLength.current) {
      messagesLength.current = messages.length;
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  });

  async function handleSend() {
    if (!text.trim() || !productId || !sellerIdStr) return;
    try {
      const sellerId = Principal.fromText(sellerIdStr);
      await sendMessage.mutateAsync({
        receiverId: sellerId,
        productId,
        text: text.trim(),
      });
      setText("");
    } catch (_e) {
      // silently fail if not authenticated
    }
  }

  if (!productId || !sellerIdStr) {
    return (
      <div className="app-shell pb-20">
        <div className="sticky top-0 z-40 bg-navy px-4 pt-10 pb-4">
          <h1 className="font-display font-bold text-xl text-white">
            Messages
          </h1>
        </div>
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center">
            <MessageCircle size={36} className="text-muted-foreground" />
          </div>
          <p className="font-semibold text-foreground">No conversations yet</p>
          <p className="text-muted-foreground text-sm text-center px-8">
            Start a conversation by clicking "Chat with Supplier" on any product
          </p>
          <Button
            className="bg-navy text-white rounded-xl px-6"
            onClick={() => navigate({ to: "/products" })}
          >
            Browse Products
          </Button>
        </div>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="app-shell flex flex-col" style={{ height: "100dvh" }}>
      <div className="sticky top-0 z-40 bg-navy px-4 pt-10 pb-4 flex items-center gap-3">
        <button
          type="button"
          onClick={() => navigate({ to: "/chat", search: {} as any })}
          className="p-1"
        >
          <ArrowLeft size={20} className="text-white" />
        </button>
        <div className="flex-1">
          <p className="text-white font-semibold text-sm">
            {product?.name ?? "Product Chat"}
          </p>
          <p className="text-white/60 text-xs">
            Supplier: {sellerIdStr?.slice(0, 10)}...
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {isLoading ? (
          <div
            data-ocid="chat.loading_state"
            className="flex justify-center py-8"
          >
            <Loader2 className="animate-spin text-navy" size={24} />
          </div>
        ) : messages.length === 0 ? (
          <div
            data-ocid="chat.empty_state"
            className="flex flex-col items-center py-12 gap-2 text-muted-foreground"
          >
            <MessageCircle size={32} className="opacity-40" />
            <p className="text-sm">No messages yet. Start the conversation!</p>
          </div>
        ) : (
          messages.map((msg, i) => {
            const isMine = msg.senderId.toString() === myPrincipal;
            return (
              <motion.div
                key={`msg-${msg.timestamp.toString()}-${i}`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${isMine ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[70%] px-4 py-2.5 text-sm ${isMine ? "bubble-sent" : "bubble-received"}`}
                >
                  {msg.text}
                </div>
              </motion.div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>

      <div className="sticky bottom-0 bg-white border-t border-border px-4 py-3 flex gap-2">
        <Input
          data-ocid="chat.message_input"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 rounded-xl h-11"
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSend();
          }}
        />
        <Button
          data-ocid="chat.send_button"
          onClick={handleSend}
          disabled={!text.trim() || sendMessage.isPending}
          className="h-11 w-11 p-0 rounded-xl bg-navy hover:bg-navy-light"
        >
          {sendMessage.isPending ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <Send size={16} />
          )}
        </Button>
      </div>
    </div>
  );
}
