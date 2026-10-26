import React, { useState, useEffect } from 'react'
import DashboardLayout from '../common/DashboardLayout'
import { api } from '../../services/api'
import { useAuth } from '../../context/AuthContext'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

const ActionTakenReport = () => {
  const { user } = useAuth()
  const menuItems = [
    { icon: '📊', label: 'Dashboard', path: '/authority/dashboard' },
    { icon: '🚨', label: 'Escalated Cases', path: '/authority/escalated' },
    { icon: '📈', label: 'Performance', path: '/authority/performance' },
    { icon: '⏰', label: 'Overdue Review', path: '/authority/overdue' },
    { icon: '🏛️', label: 'Departments', path: '/authority/departments' },
    { icon: '📄', label: 'Action Reports', path: '/authority/reports' },
    { icon: '📊', label: 'Statistics', path: '/authority/statistics' },
    { icon: '💡', label: 'Recommendations', path: '/authority/recommendations' }
  ]

  const [period, setPeriod] = useState('month')
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)

  // ===================================
  // FETCH REAL DATA
  // ===================================
  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true)
        // ✅ FIX: Pass the 'period' state as a query parameter
        const res = await api.get(`/authority/reports?period=${period}`)
        setReports(res.data?.reports || [])
      } catch (err) {
        console.error('Failed to load reports:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchReports()
  }, [period]) // 👈 This will re-run the fetch whenever the user clicks a new period button

  const getStatusConfig = (status) => {
    const map = {
      resolved: { label: 'Resolved', color: '#38A169', bg: 'rgba(56, 161, 105, 0.15)', icon: '✅' },
      'in-progress': { label: 'In Progress', color: '#3182CE', bg: 'rgba(49, 130, 206, 0.15)', icon: '🚧' },
      escalated: { label: 'Escalated', color: '#C53030', bg: 'rgba(197, 48, 48, 0.15)', icon: '🚨' },
      closed: { label: 'Closed', color: '#718096', bg: 'rgba(113, 128, 150, 0.15)', icon: '🔒' }
    }
    return map[status] || map['in-progress']
  }

  const getImpactConfig = (impact) => {
    const map = {
      Critical: { color: '#C53030', bg: 'rgba(197, 48, 48, 0.15)' },
      High: { color: '#9C4221', bg: 'rgba(156, 66, 33, 0.15)' },
      Medium: { color: '#975A16', bg: 'rgba(151, 90, 22, 0.15)' },
      Low: { color: '#2C5282', bg: 'rgba(44, 82, 130, 0.15)' }
    }
    return map[impact] || map.Medium
  }

  const stats = {
    total: reports.length,
    resolved: reports.filter((r) => r.status === 'resolved').length,
    inProgress: reports.filter((r) => r.status === 'in-progress').length,
    escalated: reports.filter((r) => r.status === 'escalated').length,
    critical: reports.filter((r) => r.priority === 'emergency').length
  }

  // ===================================
  // EXPORT PDF
  // ===================================
  const handleExportPDF = () => {
    if (reports.length === 0) return alert('No data to export')

    const doc = new jsPDF()
    
    doc.setFontSize(20)
    doc.setTextColor(44, 82, 130)
    doc.text('JanVoice - Action Taken Report', 14, 22)

    doc.setFontSize(10)
    doc.setTextColor(100)
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 30)
    doc.text(`Period: ${period.toUpperCase()}`, 14, 35)

    doc.setFontSize(12)
    doc.setTextColor(0)
    doc.text(`Total Actions: ${stats.total}  |  Resolved: ${stats.resolved}  |  In Progress: ${stats.inProgress}`, 14, 45)

    const tableColumn = ["Case ID", "Title", "Department", "Action Taken", "Priority", "Date", "Status"]
    const tableRows = reports.map(r => [
      r.complaintId || r._id,
      r.title || 'Untitled',
      r.department || 'N/A',
      r.action || 'No action recorded',
      (r.priority || 'normal').toUpperCase(),
      r.date ? new Date(r.date).toLocaleDateString() : 'N/A',
      (r.status || 'pending').toUpperCase()
    ])

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 55,
      theme: 'grid',
      headStyles: { fillColor: [44, 82, 130], textColor: 255 },
      styles: { fontSize: 9, cellPadding: 3, textColor: 50 },
      alternateRowStyles: { fillColor: [245, 247, 250] }
    })

    doc.save(`Action_Report_${new Date().toISOString().split('T')[0]}.pdf`)
  }

  // ===================================
  // EXPORT CSV
  // ===================================
  const handleExportCSV = () => {
    if (reports.length === 0) return alert('No data to export')
    
    const headers = ['Case ID', 'Title', 'Department', 'Action Taken', 'Priority', 'Date', 'Status']
    const csvRows = reports.map(r => 
      `"${r.complaintId || r._id}","${r.title}","${r.department}","${r.action}","${r.priority}","${r.date}","${r.status}"`
    )
    const csvString = [headers.join(','), ...csvRows].join('\n')

    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `Action_Report_${new Date().toISOString().split('T')[0]}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // ===================================
  // EMAIL REPORT
  // ===================================
  const handleEmailReport = () => {
    if (reports.length === 0) return alert('No data to email')

    const subject = encodeURIComponent(`JanVoice Action Report - ${period.toUpperCase()}`)
    
    // Create a text version of the table for the email body
    let body = `Action Taken Report\nGenerated by: ${user?.name || 'Higher Authority'}\nDate: ${new Date().toLocaleString()}\n\n`
    body += `Summary:\nTotal Actions: ${stats.total}\nResolved: ${stats.resolved}\nIn Progress: ${stats.inProgress}\n\n`
    body += `Recent Log:\n`
    
    reports.slice(0, 10).forEach(r => {
      body += `- [${r.complaintId || r._id}] ${r.title} (${r.status})\n`
    })

    if (reports.length > 10) {
      body += `\n...and ${reports.length - 10} more actions.`
    }

    const mailtoLink = `mailto:?subject=${subject}&body=${encodeURIComponent(body)}`
    window.location.href = mailtoLink
  }

  if (loading) {
    return (
      <DashboardLayout role="higher_authority" menuItems={menuItems} title="Action Taken Report">
        <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-tertiary)' }}>⏳ Loading reports...</div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout role="higher_authority" menuItems={menuItems} title="Action Taken Report">
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        
        {/* Header Banner */}
        <div style={{ background: 'linear-gradient(135deg, #2C5282, #4299E1)', borderRadius: '20px', padding: '32px', color: 'white', marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px', flexWrap: 'wrap', boxShadow: '0 12px 32px rgba(66, 153, 225, 0.25)' }}>
          <div>
            <h2 style={{ fontSize: '28px', fontWeight: '800', marginBottom: '8px', color: '#FFFFFF', textShadow: '0 1px 3px rgba(0,0,0,0.2)' }}>
              📄 Action Taken Report
            </h2>
            <p style={{ fontSize: '15px', opacity: 0.95, color: '#FFFFFF', fontWeight: '500', textShadow: '0 1px 3px rgba(0,0,0,0.15)' }}>
              Complete log of all actions taken on escalated cases
            </p>
          </div>
          <div style={{ display: 'flex', gap: '4px', background: 'rgba(255,255,255,0.15)', padding: '4px', borderRadius: '10px' }}>
            {['week', 'month', 'quarter', 'year'].map((p) => (
              <button key={p} onClick={() => setPeriod(p)} style={{ padding: '8px 16px', background: period === p ? 'white' : 'transparent', color: period === p ? '#2C5282' : 'white', border: 'none', borderRadius: '8px', fontWeight: '700', fontSize: '12px', cursor: 'pointer', fontFamily: 'inherit', textTransform: 'capitalize' }}>
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px', marginBottom: '20px' }}>
          {[
            { label: 'Total Actions', value: stats.total, color: '#4299E1' },
            { label: 'Resolved', value: stats.resolved, color: '#38A169' },
            { label: 'In Progress', value: stats.inProgress, color: '#3182CE' },
            { label: 'Escalated Further', value: stats.escalated, color: '#C53030' },
            { label: 'Critical Impact', value: stats.critical, color: '#9C4221' }
          ].map((s, i) => (
            <div key={i} style={{ background: 'var(--bg-surface)', borderRadius: '12px', padding: '20px', boxShadow: 'var(--shadow-sm)', borderLeft: `4px solid ${s.color}` }}>
              <div style={{ fontSize: '28px', fontWeight: '800', color: s.color, lineHeight: 1, marginBottom: '4px' }}>{s.value}</div>
              <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: '700', letterSpacing: '0.5px' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
          <button onClick={handleExportPDF} style={{ padding: '12px 24px', background: 'linear-gradient(135deg, #2C5282, #4299E1)', color: 'white', border: 'none', borderRadius: '10px', fontSize: '13px', fontWeight: '700', cursor: 'pointer', fontFamily: 'inherit', boxShadow: '0 4px 12px rgba(66, 153, 225, 0.3)' }}>
            📥 Export PDF
          </button>
          <button onClick={handleExportCSV} style={{ padding: '12px 24px', background: 'var(--bg-surface)', border: '2px solid var(--border-light)', borderRadius: '10px', fontSize: '13px', fontWeight: '700', color: 'var(--text-secondary)', cursor: 'pointer', fontFamily: 'inherit' }}>
            📊 Export CSV
          </button>
          <button onClick={handleEmailReport} style={{ padding: '12px 24px', background: 'var(--bg-surface)', border: '2px solid var(--border-light)', borderRadius: '10px', fontSize: '13px', fontWeight: '700', color: 'var(--text-secondary)', cursor: 'pointer', fontFamily: 'inherit' }}>
            📧 Email Report
          </button>
        </div>

        {/* Table */}
        <div style={{ background: 'var(--bg-surface)', borderRadius: '16px', padding: '24px', boxShadow: 'var(--shadow-sm)', overflowX: 'auto', minHeight: '300px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '20px' }}>
            📋 Action Log ({reports.length} actions)
          </h3>
          
          {reports.length === 0 ? (
            <div style={{ padding: '60px 20px', textAlign: 'center', color: 'var(--text-tertiary)' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>📭</div>
              <p>No action reports available yet.</p>
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  {['Case ID', 'Title', 'Department', 'Action Taken', 'Impact', 'Date', 'Status'].map((h) => (
                    <th key={h} style={{ textAlign: 'left', padding: '12px 14px', fontSize: '11px', fontWeight: '800', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.5px', borderBottom: '2px solid var(--border-light)', whiteSpace: 'nowrap' }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {reports.map((r, i) => {
                  const status = getStatusConfig(r.status)
                  const impact = getImpactConfig(r.priority === 'emergency' ? 'Critical' : 'High')
                  return (
                    <tr key={r._id || i} style={{ borderBottom: '1px solid var(--border-light)' }}>
                      <td style={{ padding: '14px', fontSize: '12px', fontWeight: '800', color: 'var(--text-primary)' }}>{r.complaintId || r._id}</td>
                      <td style={{ padding: '14px', fontSize: '13px', color: 'var(--text-primary)', fontWeight: '600', minWidth: '200px' }}>{r.title}</td>
                      <td style={{ padding: '14px', fontSize: '12px', color: 'var(--text-tertiary)' }}>{r.department}</td>
                      <td style={{ padding: '14px', fontSize: '12px', color: 'var(--text-secondary)', maxWidth: '240px' }}>
                        <div style={{ fontWeight: '700', marginBottom: '2px' }}>{r.action || 'No action recorded'}</div>
                      </td>
                      <td style={{ padding: '14px' }}>
                        <span style={{ padding: '4px 10px', borderRadius: '10px', fontSize: '11px', fontWeight: '700', background: impact.bg, color: impact.color }}>
                          {r.priority === 'emergency' ? 'Critical' : 'High'}
                        </span>
                      </td>
                      <td style={{ padding: '14px', fontSize: '12px', color: 'var(--text-tertiary)' }}>
                        {r.date ? new Date(r.date).toLocaleDateString() : '—'}
                      </td>
                      <td style={{ padding: '14px' }}>
                        <span style={{ padding: '4px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: '700', background: status.bg, color: status.color, whiteSpace: 'nowrap' }}>
                          {status.icon} {status.label}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}

export default ActionTakenReport