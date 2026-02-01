"use client";

import { useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button"; // Caso precise
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldAlert, ShieldCheck, Search, Activity, FileCode } from "lucide-react";
import { Badge } from "@/components/ui/badge"; // Vou usar span estilizado se não tiver badge ainda
import { ScrollArea } from "@/components/ui/scroll-area"; // Vou assumir div com overflow se não tiver scroll-area

interface LogEntry {
    id: number;
    createdAt: Date;
    inputPrompt: string;
    aiResponse: string;
    success: boolean;
    creditsSpent: number;
    attacker: {
        username: string;
        tier: string;
    };
    safe: {
        id: number;
        defenseLevel: number;
    } | null;
}

interface SecurityLogsProps {
    logs: LogEntry[];
}

export function SecurityLogs({ logs }: SecurityLogsProps) {
    const [selectedLog, setSelectedLog] = useState<LogEntry | null>(null);
    const [isOpen, setIsOpen] = useState(false);

    const handleInspect = (log: LogEntry) => {
        setSelectedLog(log);
        setIsOpen(true);
    };

    const formatDate = (date: Date) => {
        return new Intl.DateTimeFormat("en-US", {
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        }).format(new Date(date));
    };

    return (
        <>
            <Card className="bg-slate-900/50 border-slate-800">
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="flex items-center gap-2 text-cyan-400 font-mono">
                        <Activity className="w-5 h-5" />
                        SECURITY AUDIT LOGS
                    </CardTitle>
                    {/* Notification Badge could go here */}
                </CardHeader>
                <CardContent>
                    {logs.length === 0 ? (
                        <div className="text-center py-12 text-slate-500 font-mono text-sm">
                            No security incidents recorded. Your systems are quiet... for now.
                        </div>
                    ) : (
                        <div className="rounded-md border border-slate-800">
                            <Table>
                                <TableHeader className="bg-slate-900">
                                    <TableRow className="border-slate-800 hover:bg-slate-900">
                                        <TableHead className="text-slate-400 font-mono">TIMESTAMP</TableHead>
                                        <TableHead className="text-slate-400 font-mono">STATUS</TableHead>
                                        <TableHead className="text-slate-400 font-mono">ATTACKER</TableHead>
                                        <TableHead className="text-slate-400 font-mono">INJECTOR PROMPT</TableHead>
                                        <TableHead className="text-slate-400 font-mono text-right">ACTION</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {logs.map((log) => (
                                        <TableRow
                                            key={log.id}
                                            className={`border-slate-800 hover:bg-slate-900/50 font-mono text-xs transition-colors cursor-pointer ${log.success ? "bg-red-950/10 hover:bg-red-950/20" : ""
                                                }`}
                                            onClick={() => handleInspect(log)}
                                        >
                                            <TableCell className="text-slate-500">
                                                {formatDate(log.createdAt)}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    {log.success ? (
                                                        <span className="flex items-center gap-1 text-red-500 font-bold bg-red-950/30 px-2 py-1 rounded border border-red-900/50">
                                                            <ShieldAlert className="w-3 h-3" /> BREACH
                                                        </span>
                                                    ) : (
                                                        <span className="flex items-center gap-1 text-green-500 font-bold bg-green-950/30 px-2 py-1 rounded border border-green-900/50">
                                                            <ShieldCheck className="w-3 h-3" /> BLOCKED
                                                        </span>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-slate-300">
                                                <span className="text-purple-400">{log.attacker.username}</span>
                                            </TableCell>
                                            <TableCell className="max-w-[200px] truncate text-slate-500">
                                                {log.inputPrompt}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button variant="ghost" size="sm" className="text-cyan-400 hover:text-cyan-300 hover:bg-cyan-950/30">
                                                    <Search className="w-3 h-3 mr-1" />
                                                    INSPECT
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Forensic Modal */}
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="bg-slate-950 border-slate-800 max-w-2xl">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-cyan-400 font-mono text-xl">
                            <FileCode className="w-5 h-5" />
                            FORENSIC ANALYSIS REPORT #{selectedLog?.id}
                        </DialogTitle>
                        <DialogDescription className="font-mono text-xs text-slate-500">
                            Authorized access only. Analyzing attack vector on Safe #{selectedLog?.safe?.id ?? 'N/A'}.
                        </DialogDescription>
                    </DialogHeader>

                    {selectedLog && (
                        <div className="space-y-6 mt-4 font-mono text-sm">
                            {/* Meta Info */}
                            <div className="grid grid-cols-2 gap-4 bg-slate-900/50 p-4 rounded border border-slate-800">
                                <div>
                                    <span className="text-slate-500 text-xs block mb-1">ATTACKER ID</span>
                                    <span className="text-purple-400 font-bold">{selectedLog.attacker.username}</span>
                                </div>
                                <div>
                                    <span className="text-slate-500 text-xs block mb-1">FATE</span>
                                    <span className={selectedLog.success ? "text-red-500 font-bold" : "text-green-500 font-bold"}>
                                        {selectedLog.success ? "SYSTEM COMPROMISED" : "ATTACK NEUTRALIZED"}
                                    </span>
                                </div>
                            </div>

                            {/* The Attack */}
                            <div className="space-y-2">
                                <label className="text-xs text-yellow-500 font-bold flex items-center gap-2">
                                    <Activity className="w-3 h-3" />
                                    INJECTED PROMPT VECTOR
                                </label>
                                <div className="bg-slate-900 p-4 rounded border border-yellow-900/30 text-slate-300 whitespace-pre-wrap max-h-40 overflow-y-auto">
                                    {selectedLog.inputPrompt}
                                </div>
                            </div>

                            {/* The Defense Response */}
                            <div className="space-y-2">
                                <label className="text-xs text-cyan-500 font-bold flex items-center gap-2">
                                    <ShieldCheck className="w-3 h-3" />
                                    SENTINEL AI RESPONSE
                                </label>
                                <div className="bg-slate-900 p-4 rounded border border-cyan-900/30 text-slate-400 italic whitespace-pre-wrap max-h-40 overflow-y-auto">
                                    "{selectedLog.aiResponse}"
                                </div>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </>
    );
}
