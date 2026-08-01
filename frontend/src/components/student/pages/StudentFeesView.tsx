"use client";

import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Loader from "@/components/ui/Loader";
import { downloadDocument } from "@/lib/download-utils";
import {
  InvoiceItem,
  LedgerTransaction,
  BankAccountInfo,
  ScholarshipRecord,
} from "@/lib/backend-fees";

export default function StudentFeesView() {
  const [activeTab, setActiveTab] = useState<"invoices" | "ledger" | "gateways" | "scholarship">("invoices");
  const [isLoading, setIsLoading] = useState(true);

  // Fee Data State
  const [invoices, setInvoices] = useState<InvoiceItem[]>([]);
  const [ledger, setLedger] = useState<LedgerTransaction[]>([]);
  const [bankAccounts, setBankAccounts] = useState<BankAccountInfo[]>([]);
  const [scholarships, setScholarships] = useState<ScholarshipRecord[]>([]);

  // Filtering State
  const [invoiceFilter, setInvoiceFilter] = useState<"ALL" | "UNPAID" | "PAID">("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedInvoiceId, setExpandedInvoiceId] = useState<string | null>(null);

  // Modal States
  const [payingInvoice, setPayingInvoice] = useState<InvoiceItem | null>(null);
  const [selectedGateway, setSelectedGateway] = useState<string>("bKash");
  const [paymentForm, setPaymentForm] = useState({ accountNumber: "", pinOrTx: "" });

  const [showWaiverModal, setShowWaiverModal] = useState(false);
  const [waiverReason, setWaiverReason] = useState("");

  const [showBankDepositModal, setShowBankDepositModal] = useState(false);
  const [depositForm, setDepositForm] = useState({ bankName: "Sonali Bank PLC", slipNumber: "", amount: "" });

  // Fetch Data from REST API
  useEffect(() => {
    const fetchFeesData = async () => {
      setIsLoading(true);
      try {
        const res = await fetch("/api/fees");
        const data = await res.json();
        if (data.invoices) setInvoices(data.invoices);
        if (data.ledger) setLedger(data.ledger);
        if (data.bankAccounts) setBankAccounts(data.bankAccounts);
        if (data.scholarships) setScholarships(data.scholarships);
      } catch {
        toast.error("Failed to load fee ledger from backend API");
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeesData();
  }, []);

  // Handle Online Payment Confirmation
  const handleConfirmPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!payingInvoice) return;

    const updatedInvoices = invoices.map((inv) => {
      if (inv.id === payingInvoice.id) {
        return {
          ...inv,
          status: "PAID" as const,
          paidDate: new Date().toISOString().split("T")[0],
          paymentMethod: selectedGateway,
          transactionId: paymentForm.pinOrTx || `TXN-${Math.floor(100000 + Math.random() * 900000)}`,
        };
      }
      return inv;
    });

    const newLedgerItem: LedgerTransaction = {
      txId: `TXN-${Date.now().toString().slice(-6)}`,
      date: new Date().toISOString().split("T")[0],
      description: `Payment for ${payingInvoice.title} (${payingInvoice.id})`,
      invoiceRef: payingInvoice.invoiceNo,
      paymentMethod: selectedGateway as any,
      creditAmount: payingInvoice.netPayable,
      debitAmount: 0,
      balance: 0,
      status: "COMPLETED",
      receiptNo: `RCP-${Math.floor(1000 + Math.random() * 9000)}`,
    };

    setInvoices(updatedInvoices);
    setLedger([newLedgerItem, ...ledger]);
    toast.success(`Payment of ৳ ${payingInvoice.netPayable.toLocaleString()} via ${selectedGateway} successful!`);
    setPayingInvoice(null);
    setPaymentForm({ accountNumber: "", pinOrTx: "" });
  };

  // Handle Bank Slip Upload
  const handleSubmitBankSlip = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success(`Bank Deposit Slip #${depositForm.slipNumber} submitted to Accounts Office for verification!`);
    setShowBankDepositModal(false);
    setDepositForm({ bankName: "Sonali Bank PLC", slipNumber: "", amount: "" });
  };

  // Handle Waiver Application
  const handleSubmitWaiver = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Scholarship & Fee Waiver application submitted to Principal's Office!");
    setShowWaiverModal(false);
    setWaiverReason("");
  };

  // Calculated Metrics
  const totalBilled = invoices.reduce((sum, inv) => sum + inv.amount, 0);
  const totalPaid = invoices.filter((i) => i.status === "PAID").reduce((sum, inv) => sum + inv.netPayable, 0);
  const totalDues = invoices.filter((i) => i.status === "UNPAID").reduce((sum, inv) => sum + inv.netPayable, 0);
  const totalWaivers = invoices.reduce((sum, inv) => sum + inv.waiverAmount, 0);

  const filteredInvoices = invoices.filter((inv) => {
    if (invoiceFilter === "UNPAID" && inv.status !== "UNPAID") return false;
    if (invoiceFilter === "PAID" && inv.status !== "PAID") return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        inv.title.toLowerCase().includes(q) ||
        inv.id.toLowerCase().includes(q) ||
        inv.category.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6 font-outfit">

      {/* ── Hero Banner ── */}
      <div className="bg-[#0B0F17] text-white p-6 rounded-md shadow-xl">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-5">
          <div className="space-y-2">
            <span className="bg-white/10 border border-white/20 text-white font-bold text-[10px] px-3 py-1 rounded-md uppercase tracking-widest">
              Schollege MS · Accounts &amp; Finance Portal
            </span>
            <h1 className="text-2xl font-bold text-white">Student Payment Ledger & Financial Portal</h1>
            <p className="text-xs text-slate-400">
              Class 12-A &nbsp;·&nbsp; Roll #261-12-0003 &nbsp;·&nbsp; Science Stream &nbsp;·&nbsp; Student ID: 2026-12-003
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2 self-start">
            <button
              onClick={() => {
                const unpaid = invoices.find((i) => i.status === "UNPAID");
                if (unpaid) setPayingInvoice(unpaid);
                else toast.info("All invoices are currently fully cleared!");
              }}
              className="border-none bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs px-4 py-2.5 rounded-md flex items-center gap-2 shadow-md cursor-pointer transition"
            >
              <i className="fi fi-rr-credit-card text-xs" />
              Make Quick Payment +
            </button>
            <button
              onClick={() => {
                const statement = `====================================================
SCHOLLEGE FINANCIAL LEDGER STATEMENT (2026)
====================================================
Student ID: SCH-2026-1024
Total Billed: BDT ${totalBilled.toLocaleString()}
Total Paid: BDT ${totalPaid.toLocaleString()}
Outstanding Dues: BDT ${totalDues.toLocaleString()}
Approved Waivers: BDT ${totalWaivers.toLocaleString()}

Generated on: ${new Date().toLocaleString()}
Schollege School & College Management System
====================================================`;
                downloadDocument("Student_Annual_Financial_Ledger.txt", statement);
              }}
              className="border border-white/20 bg-white/10 hover:bg-white/20 text-white font-normal text-base px-4 py-2.5 rounded-md flex items-center gap-2 cursor-pointer transition"
            >
              <i className="fi fi-rr-download text-base text-white" />
              Download Statement
            </button>
          </div>
        </div>

        {/* ── KPI Gradient Cards (No Border, Taller py-6, text-4xl) ── */}
        <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-gradient-to-br from-slate-600 to-slate-800 rounded-md px-5 py-6 text-center shadow-lg">
            <p className="text-xs text-white/70 font-semibold uppercase tracking-wider">Total Billed</p>
            <p className="text-4xl font-extrabold mt-1.5 text-white">৳ {totalBilled.toLocaleString()}</p>
            <p className="text-xs text-white/60 mt-1">3 Fee Heads</p>
          </div>

          <div className="bg-gradient-to-br from-emerald-500 to-teal-700 rounded-md px-5 py-6 text-center shadow-lg">
            <p className="text-xs text-white/70 font-semibold uppercase tracking-wider">Total Settled</p>
            <p className="text-4xl font-extrabold mt-1.5 text-white">৳ {totalPaid.toLocaleString()}</p>
            <p className="text-xs text-white/60 mt-1">Receipts Available</p>
          </div>

          <div className={`rounded-md px-5 py-6 text-center shadow-lg ${
            totalDues > 0 ? "bg-gradient-to-br from-rose-500 to-red-700" : "bg-gradient-to-br from-emerald-500 to-green-700"
          }`}>
            <p className="text-xs text-white/70 font-semibold uppercase tracking-wider">Current Dues</p>
            <p className="text-4xl font-extrabold mt-1.5 text-white">৳ {totalDues.toLocaleString()}</p>
            <p className="text-xs text-white/60 mt-1">{totalDues > 0 ? "Due: Aug 25, 2026" : "Account Clear"}</p>
          </div>

          <div className="bg-gradient-to-br from-violet-500 to-purple-700 rounded-md px-5 py-6 text-center shadow-lg">
            <p className="text-xs text-white/70 font-semibold uppercase tracking-wider">Merit Waiver</p>
            <p className="text-4xl font-extrabold mt-1.5 text-white">৳ {totalWaivers.toLocaleString()}</p>
            <p className="text-xs text-white/60 mt-1">15% Distinction Grant</p>
          </div>
        </div>
      </div>

      {/* ── Sub-Page Navigation Tabs ── */}
      <div className="bg-white border border-gray-200 rounded-md shadow-xs">
        <div className="flex items-center border-b border-gray-100 px-4 pt-4 gap-1 overflow-x-auto">
          {[
            { key: "invoices",    label: "💳 Fee Invoices & Dues" },
            { key: "ledger",      label: "📜 Payment Statement Ledger" },
            { key: "gateways",    label: "🏛️ Bank & Payment Gateways" },
            { key: "scholarship", label: "🧾 Scholarship & Fee Waiver" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`text-xs font-bold px-4 py-2.5 rounded-md border-none cursor-pointer transition whitespace-nowrap ${
                activeTab === tab.key
                  ? "bg-black text-white"
                  : "text-gray-500 hover:bg-gray-100"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="p-5">
          {isLoading ? (
            <div className="py-16 flex flex-col items-center justify-center">
              <Loader size="md" text="Loading financial ledger data from backend API..." />
            </div>
          ) : (

            <>
              {/* ───────────────────────────────────────────────────────────── */}
              {/* SUB-PAGE 1: FEEN INVOICES & DUES                             */}
              {/* ───────────────────────────────────────────────────────────── */}
              {activeTab === "invoices" && (
                <div className="space-y-4">
                  {/* Search and Filters */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-gray-100">
                    <div className="flex items-center gap-2">
                      {(["ALL", "UNPAID", "PAID"] as const).map((status) => (
                        <button
                          key={status}
                          onClick={() => setInvoiceFilter(status)}
                          className={`text-xs font-bold px-3 py-1.5 rounded-md border cursor-pointer transition ${
                            invoiceFilter === status
                              ? "bg-black text-white border-black"
                              : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                          }`}
                        >
                          {status === "ALL" ? "All Invoices" : status}
                        </button>
                      ))}
                    </div>

                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Search invoice title or ID..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full sm:w-64 text-xs px-3 py-1.5 rounded-md border border-gray-300 focus:outline-none focus:border-black"
                      />
                    </div>
                  </div>

                  {/* Invoice List */}
                  <div className="space-y-3">
                    {filteredInvoices.length === 0 ? (
                      <div className="p-10 text-center text-xs text-gray-400 font-semibold">
                        No invoices match your selected filter criteria.
                      </div>
                    ) : (
                      filteredInvoices.map((inv) => {
                        const isExpanded = expandedInvoiceId === inv.id;
                        return (
                          <div
                            key={inv.id}
                            className="border border-gray-200 rounded-md bg-white hover:border-gray-300 transition overflow-hidden"
                          >
                            <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                              <div className="space-y-1">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="bg-gray-100 text-gray-800 font-bold text-[10px] px-2.5 py-0.5 rounded-md uppercase">
                                    {inv.id}
                                  </span>
                                  <span className="bg-indigo-50 text-indigo-700 font-bold text-[10px] px-2 py-0.5 rounded-md">
                                    {inv.category}
                                  </span>
                                  <span
                                    className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-md ${
                                      inv.status === "PAID"
                                        ? "bg-emerald-100 text-emerald-800"
                                        : "bg-rose-100 text-rose-800"
                                    }`}
                                  >
                                    {inv.status}
                                  </span>
                                </div>
                                <h3 className="text-sm font-bold text-gray-900">{inv.title}</h3>
                                <p className="text-[11px] text-gray-500">
                                  Term: <strong>{inv.term}</strong> &nbsp;·&nbsp; Due Date:{" "}
                                  <span className="font-semibold text-gray-700">{inv.dueDate}</span>
                                  {inv.paidDate && ` · Settled on ${inv.paidDate} (${inv.paymentMethod})`}
                                </p>
                              </div>

                              <div className="flex items-center gap-4 shrink-0">
                                <div className="text-right">
                                  <p className="text-xs text-gray-400 line-through">৳ {inv.amount.toLocaleString()}</p>
                                  <p className="text-base font-extrabold text-gray-900">৳ {inv.netPayable.toLocaleString()}</p>
                                  {inv.waiverAmount > 0 && (
                                    <p className="text-[10px] font-bold text-emerald-600">
                                      Waiver: -৳ {inv.waiverAmount.toLocaleString()}
                                    </p>
                                  )}
                                </div>

                                <div className="flex items-center gap-2">
                                  <button
                                    onClick={() => setExpandedInvoiceId(isExpanded ? null : inv.id)}
                                    className="p-2 rounded-md border border-gray-200 text-gray-600 hover:bg-gray-50 text-xs font-bold cursor-pointer"
                                    title="Toggle Fee Breakdown"
                                  >
                                    <i className={`fi ${isExpanded ? "fi-rr-angle-up" : "fi-rr-angle-down"}`} />
                                  </button>

                                  {inv.status === "UNPAID" ? (
                                    <button
                                      onClick={() => setPayingInvoice(inv)}
                                      className="bg-black hover:bg-black/90 text-white font-bold text-xs px-4 py-2 rounded-md transition cursor-pointer border-none shadow-sm"
                                    >
                                      Pay Online →
                                    </button>
                                  ) : (
                                    <button
                                      onClick={() => {
                                        const receipt = `====================================================
OFFICIAL PAYMENT RECEIPT - INVOICE #${inv.id}
====================================================
Fee Description: ${inv.title}
Base Fee Amount: BDT ${inv.amount}
Net Paid Amount: BDT ${inv.netPayable}
Payment Date: ${inv.paidDate || "Paid"}
Payment Method: ${(inv as any).paymentMethod || "Online Gateway"}
Transaction Status: ${inv.status}

Institution: Schollege MS Campus
====================================================`;
                                        downloadDocument(`Payment_Receipt_${inv.id}.txt`, receipt);
                                      }}
                                      className="bg-black hover:bg-slate-800 text-white font-normal text-sm px-4 py-2 rounded-md transition cursor-pointer border-none shadow-xs"
                                    >
                                      Receipt ↓
                                    </button>
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* Itemized Fee Breakdown Accordion */}
                            {isExpanded && (
                              <div className="bg-gray-50 p-4 border-t border-gray-100 text-xs space-y-2">
                                <p className="font-bold text-gray-700 uppercase text-[10px] tracking-wider">
                                  Itemized Component Breakdown
                                </p>
                                <div className="divide-y divide-gray-200">
                                  {inv.breakdown.map((item, idx) => (
                                    <div key={idx} className="py-1.5 flex justify-between text-gray-600">
                                      <span>{item.item}</span>
                                      <span className="font-bold text-gray-900">৳ {item.cost.toLocaleString()}</span>
                                    </div>
                                  ))}
                                  <div className="py-1.5 flex justify-between font-bold text-emerald-700">
                                    <span>Merit Waiver Distinction Discount (15%)</span>
                                    <span>- ৳ {inv.waiverAmount.toLocaleString()}</span>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              )}

              {/* ───────────────────────────────────────────────────────────── */}
              {/* SUB-PAGE 2: PAYMENT STATEMENT LEDGER                          */}
              {/* ───────────────────────────────────────────────────────────── */}
              {activeTab === "ledger" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-gray-900">Official Credit/Debit Statement Ledger</h3>
                      <p className="text-[11px] text-gray-500 mt-0.5">
                        Complete chronological audit log of institutional fee transactions and receipts
                      </p>
                    </div>
                    <button
                      onClick={() => toast.success("Transaction Ledger exported as CSV!")}
                      className="text-xs font-bold bg-gray-100 hover:bg-gray-200 text-gray-800 px-3.5 py-2 rounded-md border-none cursor-pointer"
                    >
                      Export CSV ↓
                    </button>
                  </div>

                  <div className="overflow-x-auto rounded-md border border-gray-200">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="bg-gray-900 text-white uppercase text-[10px] font-bold">
                          <th className="p-3">Tx ID</th>
                          <th className="p-3">Date</th>
                          <th className="p-3">Description</th>
                          <th className="p-3">Invoice Ref</th>
                          <th className="p-3">Payment Method</th>
                          <th className="p-3 text-right">Amount Paid</th>
                          <th className="p-3 text-center">Receipt No</th>
                          <th className="p-3 text-center">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 font-medium text-gray-800">
                        {ledger.map((tx) => (
                          <tr key={tx.txId} className="hover:bg-gray-50/80 transition">
                            <td className="p-3 font-bold text-gray-900">{tx.txId}</td>
                            <td className="p-3 text-gray-600">{tx.date}</td>
                            <td className="p-3 font-medium text-gray-900 max-w-[260px]">{tx.description}</td>
                            <td className="p-3">
                              <span className="bg-gray-100 text-gray-700 font-bold text-[10px] px-2 py-0.5 rounded-md">
                                {tx.invoiceRef}
                              </span>
                            </td>
                            <td className="p-3 font-semibold text-indigo-700">{tx.paymentMethod}</td>
                            <td className="p-3 text-right font-extrabold text-emerald-700">
                              ৳ {tx.creditAmount.toLocaleString()}
                            </td>
                            <td className="p-3 text-center font-bold text-gray-600">{tx.receiptNo}</td>
                            <td className="p-3 text-center">
                              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-md">
                                {tx.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* ───────────────────────────────────────────────────────────── */}
              {/* SUB-PAGE 3: BANK & PAYMENT GATEWAYS                           */}
              {/* ───────────────────────────────────────────────────────────── */}
              {activeTab === "gateways" && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h3 className="text-sm font-bold text-gray-900">Institutional Bank & Online Merchant Accounts</h3>
                      <p className="text-[11px] text-gray-500 mt-0.5">
                        Official deposit accounts for direct bank transfer, bKash, Nagad, and NexusPay
                      </p>
                    </div>
                    <button
                      onClick={() => setShowBankDepositModal(true)}
                      className="bg-black hover:bg-black/90 text-white font-bold text-xs px-4 py-2.5 rounded-md transition cursor-pointer border-none shadow-sm"
                    >
                      + Submit Bank Deposit Slip
                    </button>
                  </div>

                  {/* Bank Accounts Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {bankAccounts.map((acc, idx) => (
                      <div key={idx} className="p-5 rounded-md border border-gray-200 bg-white space-y-3 shadow-xs">
                        <div className="flex items-center justify-between">
                          <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-md ${
                            acc.type === "Bank" ? "bg-blue-100 text-blue-800" : "bg-pink-100 text-pink-800"
                          }`}>
                            {acc.type} Account
                          </span>
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(acc.accountNumber);
                              toast.info(`Account number ${acc.accountNumber} copied to clipboard!`);
                            }}
                            className="text-xs font-bold text-gray-500 hover:text-black border-none bg-transparent cursor-pointer"
                          >
                            Copy Account #
                          </button>
                        </div>

                        <div>
                          <h4 className="text-base font-bold text-gray-900">{acc.bankName}</h4>
                          <p className="text-xs text-gray-500 mt-0.5">{acc.branch}</p>
                        </div>

                        <div className="bg-gray-50 p-3 rounded-md border border-gray-100 text-xs space-y-1 font-mono">
                          <p className="text-gray-500 text-[10px] font-sans font-semibold uppercase">Account Name</p>
                          <p className="font-bold text-gray-900 font-sans">{acc.accountName}</p>
                          <p className="text-gray-500 text-[10px] font-sans font-semibold uppercase pt-1">Account Number</p>
                          <p className="text-sm font-extrabold text-black tracking-wider">{acc.accountNumber}</p>
                          {acc.routingNumber && (
                            <p className="text-gray-500 text-[10px] font-sans pt-1">
                              Routing #: <strong className="text-gray-800">{acc.routingNumber}</strong>
                            </p>
                          )}
                          {acc.paymentCode && (
                            <p className="text-emerald-700 text-[11px] font-sans font-bold pt-1">
                              {acc.paymentCode}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ───────────────────────────────────────────────────────────── */}
              {/* SUB-PAGE 4: SCHOLARSHIP & FEE WAIVER                          */}
              {/* ───────────────────────────────────────────────────────────── */}
              {activeTab === "scholarship" && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h3 className="text-sm font-bold text-gray-900">Merit Scholarship & Financial Aid Status</h3>
                      <p className="text-[11px] text-gray-500 mt-0.5">
                        Active board stipends, merit discounts, and tuition waiver applications
                      </p>
                    </div>
                    <button
                      onClick={() => setShowWaiverModal(true)}
                      className="bg-black hover:bg-black/90 text-white font-bold text-xs px-4 py-2.5 rounded-md transition cursor-pointer border-none shadow-sm"
                    >
                      Apply for Fee Waiver +
                    </button>
                  </div>

                  {/* Active Grants List */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {scholarships.map((sch) => (
                      <div key={sch.id} className="p-5 rounded-md border border-gray-200 bg-white space-y-3 shadow-xs">
                        <div className="flex items-center justify-between">
                          <span className="bg-emerald-100 text-emerald-800 font-extrabold text-[10px] px-2.5 py-0.5 rounded-md">
                            {sch.category} ({sch.discountPercentage}% OFF)
                          </span>
                          <span className="bg-gray-100 text-gray-700 font-bold text-[10px] px-2.5 py-0.5 rounded-md">
                            {sch.status}
                          </span>
                        </div>

                        <div>
                          <h4 className="text-base font-bold text-gray-900">{sch.title}</h4>
                          <p className="text-xs text-gray-500 mt-1">
                            Granted by: <strong>{sch.grantedBy}</strong> &nbsp;·&nbsp; {sch.validPeriod}
                          </p>
                        </div>

                        <div className="bg-emerald-50 p-3 rounded-md border border-emerald-100 flex items-center justify-between">
                          <span className="text-xs font-bold text-emerald-900">Per Semester Savings</span>
                          <span className="text-sm font-extrabold text-emerald-700">৳ {sch.discountAmount.toLocaleString()}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* ── ONLINE PAYMENT MODAL ── */}
      {payingInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-md rounded-md bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-gray-900">Online Fee Payment Gateway</h3>
                <p className="text-[11px] text-gray-500">{payingInvoice.id} · Schollege Accounts</p>
              </div>
              <button
                onClick={() => setPayingInvoice(null)}
                className="text-gray-400 hover:text-black border-none cursor-pointer bg-transparent text-lg"
              >
                ✕
              </button>
            </div>

            <div className="p-4 rounded-md bg-gray-50 border border-gray-200 text-xs space-y-1">
              <p className="font-bold text-gray-900">{payingInvoice.title}</p>
              <div className="flex justify-between text-gray-600 pt-1">
                <span>Gross Invoice Amount:</span>
                <span>৳ {payingInvoice.amount.toLocaleString()}</span>
              </div>
              {payingInvoice.waiverAmount > 0 && (
                <div className="flex justify-between text-emerald-600 font-bold">
                  <span>15% Merit Waiver Discount:</span>
                  <span>- ৳ {payingInvoice.waiverAmount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between text-sm font-extrabold text-black pt-2 border-t border-gray-200">
                <span>Net Payable:</span>
                <span className="text-emerald-700">৳ {payingInvoice.netPayable.toLocaleString()}</span>
              </div>
            </div>

            <form onSubmit={handleConfirmPayment} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-2">Select Payment Method</label>
                <div className="grid grid-cols-3 gap-2">
                  {["bKash", "Nagad", "Rocket", "DBBL NexusPay", "Card", "Bank Transfer"].map((gw) => (
                    <button
                      key={gw}
                      type="button"
                      onClick={() => setSelectedGateway(gw)}
                      className={`p-2.5 rounded-md font-bold text-center border cursor-pointer transition ${
                        selectedGateway === gw
                          ? "bg-black text-white border-black shadow-sm"
                          : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
                      }`}
                    >
                      {gw}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  {selectedGateway} Account / Mobile Number
                </label>
                <input
                  type="text"
                  required
                  placeholder="01711-XXXXXX"
                  value={paymentForm.accountNumber}
                  onChange={(e) => setPaymentForm((p) => ({ ...p, accountNumber: e.target.value }))}
                  className="w-full p-2.5 rounded-md border border-gray-300 focus:outline-none focus:border-black text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Transaction ID / Reference PIN
                </label>
                <input
                  type="text"
                  required
                  placeholder="BK9X72L90M"
                  value={paymentForm.pinOrTx}
                  onChange={(e) => setPaymentForm((p) => ({ ...p, pinOrTx: e.target.value }))}
                  className="w-full p-2.5 rounded-md border border-gray-300 focus:outline-none focus:border-black text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setPayingInvoice(null)}
                  className="px-4 py-2 rounded-md bg-gray-100 font-semibold text-gray-600 border-none cursor-pointer hover:bg-gray-200 text-xs transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white font-bold border-none cursor-pointer text-xs transition shadow-md"
                >
                  Confirm &amp; Pay ৳ {payingInvoice.netPayable.toLocaleString()}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── BANK SLIP MODAL ── */}
      {showBankDepositModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-md rounded-md bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-base font-bold text-gray-900">Bank Deposit Slip Upload</h3>
              <button
                onClick={() => setShowBankDepositModal(false)}
                className="text-gray-400 hover:text-black border-none cursor-pointer bg-transparent text-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitBankSlip} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Target Bank Account</label>
                <select
                  value={depositForm.bankName}
                  onChange={(e) => setDepositForm((p) => ({ ...p, bankName: e.target.value }))}
                  className="w-full p-2.5 rounded-md border border-gray-300 focus:outline-none focus:border-black text-xs"
                >
                  <option value="Sonali Bank PLC">Sonali Bank PLC (Campus Branch)</option>
                  <option value="Dutch-Bangla Bank PLC">Dutch-Bangla Bank PLC (DBBL)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Deposit Slip / Counterfoil #</label>
                <input
                  type="text"
                  required
                  placeholder="SLIP-2026-9904"
                  value={depositForm.slipNumber}
                  onChange={(e) => setDepositForm((p) => ({ ...p, slipNumber: e.target.value }))}
                  className="w-full p-2.5 rounded-md border border-gray-300 focus:outline-none focus:border-black text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Amount Deposited (৳)</label>
                <input
                  type="number"
                  required
                  placeholder="10625"
                  value={depositForm.amount}
                  onChange={(e) => setDepositForm((p) => ({ ...p, amount: e.target.value }))}
                  className="w-full p-2.5 rounded-md border border-gray-300 focus:outline-none focus:border-black text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowBankDepositModal(false)}
                  className="px-4 py-2 rounded-md bg-gray-100 font-semibold text-gray-600 border-none cursor-pointer hover:bg-gray-200 text-xs transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-md bg-black hover:bg-black/90 text-white font-bold border-none cursor-pointer text-xs transition"
                >
                  Submit Deposit Slip
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── FEE WAIVER MODAL ── */}
      {showWaiverModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-md rounded-md bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-base font-bold text-gray-900">Scholarship / Fee Waiver Application</h3>
              <button
                onClick={() => setShowWaiverModal(false)}
                className="text-gray-400 hover:text-black border-none cursor-pointer bg-transparent text-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitWaiver} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Application Reason</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Provide justification (Academic Merit GPA 5.00, Board Scholarship, Financial Assistance...)"
                  value={waiverReason}
                  onChange={(e) => setWaiverReason(e.target.value)}
                  className="w-full p-2.5 rounded-md border border-gray-300 focus:outline-none focus:border-black text-xs resize-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowWaiverModal(false)}
                  className="px-4 py-2 rounded-md bg-gray-100 font-semibold text-gray-600 border-none cursor-pointer hover:bg-gray-200 text-xs transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-md bg-black hover:bg-black/90 text-white font-bold border-none cursor-pointer text-xs transition"
                >
                  Submit Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
