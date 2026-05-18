"use client";

import { useCallback, useRef, useState } from "react";
import { Upload, FileText, X, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { cn } from "@/lib/utils";
import { useCSVParser } from "../hooks/use-csv-parser";
import type { Participant } from "../types";

type CSVUploadProps = {
  onUpload: (participants: Participant[]) => void;
  participantCount: number;
};

export function CSVUpload({ onUpload, participantCount }: CSVUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { parseCSV } = useCSVParser();

  const processFile = useCallback(
    async (file: File) => {
      setErrors([]);
      setFileName(file.name);

      try {
        const content = await file.text();
        const result = parseCSV(content);

        if (result.errors.length > 0) {
          setErrors(result.errors);
        }

        if (result.participants.length > 0) {
          onUpload(result.participants);
        } else {
          setErrors((prev) => [...prev, "No valid participants found in file"]);
        }
      } catch {
        setErrors(["Failed to read file"]);
      }
    },
    [parseCSV, onUpload]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      const file = e.dataTransfer.files[0];
      if (file && (file.type === "text/csv" || file.name.endsWith(".csv"))) {
        processFile(file);
      } else {
        setErrors(["Please upload a CSV file"]);
      }
    },
    [processFile]
  );

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        processFile(file);
      }
    },
    [processFile]
  );

  const handleClear = useCallback(() => {
    setFileName(null);
    setErrors([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, []);

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-lg">
          <span>Participants</span>
          {participantCount > 0 && (
            <span className="text-sm font-normal text-gold">
              {participantCount} loaded
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div
          className={cn(
            "relative rounded-lg border-2 border-dashed p-6 text-center transition-colors",
            isDragging
              ? "border-gold bg-gold/10"
              : "border-muted-foreground/25 hover:border-muted-foreground/50"
          )}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            onChange={handleFileSelect}
            className="hidden"
          />

          {fileName ? (
            <div className="flex items-center justify-center gap-2">
              <FileText className="h-5 w-5 text-gold" />
              <span className="text-sm">{fileName}</span>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
                onClick={handleClear}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <>
              <Upload className="mx-auto h-10 w-10 text-muted-foreground" />
              <p className="mt-2 text-sm text-muted-foreground">
                Drag and drop a CSV file, or
              </p>
              <Button
                variant="outline"
                size="sm"
                className="mt-2"
                onClick={() => fileInputRef.current?.click()}
              >
                Browse Files
              </Button>
            </>
          )}
        </div>

        {errors.length > 0 && (
          <Alert variant="destructive" className="mt-3">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <ul className="list-inside list-disc text-xs">
                {errors.slice(0, 3).map((error, i) => (
                  <li key={i}>{error}</li>
                ))}
                {errors.length > 3 && (
                  <li>...and {errors.length - 3} more warnings</li>
                )}
              </ul>
            </AlertDescription>
          </Alert>
        )}

        <p className="mt-3 text-xs text-muted-foreground">
          Expected format: Name, Employee ID, Department (columns are auto-detected)
        </p>
      </CardContent>
    </Card>
  );
}
