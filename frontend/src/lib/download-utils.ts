import { toast } from "react-toastify";

/**
 * Utility function to log a notification to the backend API & refresh bell counts.
 */
export async function pushNotification(title: string, message: string, type: "NOTICE" | "STUDENT" | "TEACHER" | "EXAM" | "FINANCE" | "ASSIGNMENT" | "SYSTEM" = "SYSTEM", targetRole: "ALL" | "STUDENT" | "TEACHER" | "ADMIN" = "ALL") {
  try {
    await fetch("/api/notifications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type,
        title,
        message,
        priority: "MEDIUM",
        targetRole,
        senderName: "Document & Portal Action Engine",
      }),
    });
    // Notify all headers to instantly refresh notification list and unread count
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("notification-updated"));
    }
  } catch (err) {
    console.error("Failed to push notification to API:", err);
  }
}

/**
 * Utility function to generate and download real files directly in the user's browser,
 * show toast notification, AND add the event to the Notification Bell panel.
 */
export async function downloadDocument(
  filename: string,
  contentText: string,
  mimeType: string = "text/plain",
  targetRole: "ALL" | "STUDENT" | "TEACHER" | "ADMIN" = "ALL"
) {
  try {
    // 1. Generate & download file
    const blob = new Blob([contentText], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    // 2. Show Toast Notification
    const toastMsg = `Downloaded "${filename}" successfully!`;
    toast.success(toastMsg);

    // 3. Post to Notifications API and increase count in notification div
    await pushNotification(
      `Downloaded ${filename}`,
      `Document file "${filename}" was downloaded to your local device.`,
      "SYSTEM",
      targetRole
    );
  } catch (err) {
    console.error("Error triggering file download:", err);
    toast.error(`Failed to download ${filename}`);
  }
}
