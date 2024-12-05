import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, File, Folder } from "lucide-react";

export default function Documents() {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Document Management</h2>
        <Button>
          <Upload className="mr-2 h-4 w-4" /> Upload Document
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="hover-card">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Folder className="mr-2 h-5 w-5 text-primary" />
              Legal Documents
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Store and manage all legal documentation
            </p>
          </CardContent>
        </Card>

        <Card className="hover-card">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Folder className="mr-2 h-5 w-5 text-primary" />
              Financial Reports
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Quarterly and annual financial reports
            </p>
          </CardContent>
        </Card>

        <Card className="hover-card">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Folder className="mr-2 h-5 w-5 text-primary" />
              Due Diligence
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Company research and analysis documents
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Documents</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center">
                  <File className="h-8 w-8 text-primary mr-4" />
                  <div>
                    <p className="font-medium">Document {i}.pdf</p>
                    <p className="text-sm text-muted-foreground">
                      Added on {new Date().toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  Download
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}