import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useInquiriesForProvider, useUpdateInquiryStatus } from "@/hooks/useInquiries";
import { Mail, Phone, MessageSquare, Clock, CheckCircle } from "lucide-react";
import { toast } from "sonner";

export default function DashboardInquiries() {
  const { data: inquiries, isLoading } = useInquiriesForProvider();
  const updateStatus = useUpdateInquiryStatus();

  const handleMarkAsRead = async (id: string) => {
    try {
      await updateStatus.mutateAsync({ id, status: "read" });
      toast.success("Marked as read");
    } catch {
      toast.error("Failed to update status");
    }
  };

  const getStatusBadge = (status: string | null) => {
    switch (status) {
      case "new":
        return <Badge className="bg-primary/10 text-primary hover:bg-primary/10">New</Badge>;
      case "read":
        return <Badge variant="secondary">Read</Badge>;
      case "replied":
        return <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Replied</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <DashboardLayout title="Inquiries" description="Messages from potential customers">
      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      ) : inquiries && inquiries.length > 0 ? (
        <div className="space-y-4">
          {inquiries.map((inquiry) => (
            <Card key={inquiry.id} className={inquiry.status === "new" ? "border-primary/50" : ""}>
              <CardContent className="p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold">{inquiry.name}</h3>
                      {getStatusBadge(inquiry.status)}
                    </div>
                    
                    <p className="mt-1 text-sm text-muted-foreground">
                      Interested in: {inquiry.services?.title}
                    </p>
                    
                    <div className="mt-3 flex flex-wrap gap-3 text-sm text-muted-foreground">
                      <a 
                        href={`mailto:${inquiry.email}`} 
                        className="flex items-center gap-1 hover:text-primary"
                      >
                        <Mail className="h-4 w-4" />
                        {inquiry.email}
                      </a>
                      {inquiry.phone && (
                        <a 
                          href={`tel:${inquiry.phone}`} 
                          className="flex items-center gap-1 hover:text-primary"
                        >
                          <Phone className="h-4 w-4" />
                          {inquiry.phone}
                        </a>
                      )}
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {new Date(inquiry.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    
                    <div className="mt-4 rounded-lg bg-secondary p-4">
                      <div className="flex items-start gap-2">
                        <MessageSquare className="mt-0.5 h-4 w-4 text-muted-foreground" />
                        <p className="text-sm">{inquiry.message}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    {inquiry.status === "new" && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleMarkAsRead(inquiry.id)}
                        disabled={updateStatus.isPending}
                      >
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Mark as Read
                      </Button>
                    )}
                    <a href={`mailto:${inquiry.email}`}>
                      <Button size="sm">
                        <Mail className="mr-2 h-4 w-4" />
                        Reply
                      </Button>
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-12 text-center">
            <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground" />
            <p className="mt-4 text-muted-foreground">No inquiries yet.</p>
            <p className="text-sm text-muted-foreground">
              When customers contact you about your services, their messages will appear here.
            </p>
          </CardContent>
        </Card>
      )}
    </DashboardLayout>
  );
}
