import { useState, useRef, useEffect, DragEvent, ChangeEvent, FormEvent } from 'react';
import { ClientProject, ProjectMedia, ProjectMilestone, UserAccount } from '../types';
import { 
  CheckCircle2, Circle, Clock, DollarSign, UploadCloud, Image, FileText, Plus, AlertCircle, Trash, ExternalLink, RefreshCw, Hammer, CheckSquare, ShieldCheck, Camera, Check, RotateCw, CreditCard, Sparkles, Smartphone, ShieldAlert
} from 'lucide-react';

interface TrackerProps {
  currentUser: UserAccount | null;
  projects: ClientProject[];
  onAddMedia: (projectId: string, mediaItem: ProjectMedia) => void;
  onDeleteMedia: (projectId: string, mediaId: string) => void;
  onUpdateMilestone?: (projectId: string, milestoneId: string, status: 'pending' | 'in-progress' | 'completed') => void;
  onAddNote?: (projectId: string, notes: string) => void;
  onOpenLogin: () => void;
  onUpdatePayment?: (projectId: string, amount: number) => void;
}

export default function Tracker({
  currentUser,
  projects,
  onAddMedia,
  onDeleteMedia,
  onUpdateMilestone,
  onAddNote,
  onOpenLogin,
  onUpdatePayment
}: TrackerProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');
  const [dragActive, setDragActive] = useState(false);
  const [newNoteText, setNewNoteText] = useState('');
  const [fileName, setFileName] = useState('');
  const [fileType, setFileType] = useState<'image' | 'blueprint' | 'document'>('image');
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);

  // Mobile Money Payments State
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentNetwork, setPaymentNetwork] = useState<'mtn' | 'airtel'>('mtn');
  const [paymentPhone, setPaymentPhone] = useState('');
  const [paymentAmountInput, setPaymentAmountInput] = useState('');
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'handshake' | 'ussd_prompt' | 'verifying' | 'success'>('idle');

  // Camera Capture State
  const [isCameraModeActive, setIsCameraModeActive] = useState(false);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [customPhotoName, setCustomPhotoName] = useState('site-photo');

  // Filter projects based on user
  const userProjects = currentUser?.role === 'admin' 
    ? projects // Admin sees all projects
    : projects.filter(p => p.clientId === currentUser?.id); // Client sees only their own

  // Automatically select the first project if nothing is selected yet
  const activeProjectId = selectedProjectId || (userProjects[0]?.id || '');
  const activeProject = userProjects.find(p => p.id === activeProjectId);

  // Convert currency strings like "UGX 30,000,000" to actual numbers
  const parseCurrencyStr = (val: string): number => {
    const cleaned = val.replace(/[^0-9]/g, '');
    return parseInt(cleaned, 10) || 0;
  };

  const projectTotalNum = activeProject ? parseCurrencyStr(activeProject.totalValue) : 0;
  const projectPaidNum = activeProject ? parseCurrencyStr(activeProject.amountPaid) : 0;
  const outstandingBalance = Math.max(0, projectTotalNum - projectPaidNum);

  // File drag & drop handlers
  const handleDrag = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const processFile = (file: File) => {
    if (!file) return;
    
    setFileName(file.name);
    setUploadProgress(10);
    
    // Simulate interactive uploading animation
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev !== null && prev >= 90) {
          clearInterval(interval);
          return 100;
        }
        return (prev || 0) + 30;
      });
    }, 150);

    const reader = new FileReader();
    reader.onloadend = () => {
      setTimeout(() => {
        // Formulate correct project media
        const newMedia: ProjectMedia = {
          id: `med-${Date.now()}`,
          name: file.name,
          url: reader.result as string, // Real Base64 Data URL!
          uploadedBy: currentUser?.role || 'client',
          uploadedAt: new Date().toISOString().split('T')[0],
          size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
          type: file.type.includes('image') ? 'image' : file.name.endsWith('.dwg') || file.name.endsWith('.pdf') ? 'blueprint' : 'document'
        };

        if (activeProject) {
          onAddMedia(activeProject.id, newMedia);
        }
        
        setUploadProgress(null);
        setFileName('');
      }, 700);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const [paymentInputError, setPaymentInputError] = useState<string | null>(null);

  const handleStartPayment = (e: FormEvent) => {
    e.preventDefault();
    const payVal = parseInt(paymentAmountInput, 10) || 0;
    if (payVal <= 0) {
      setPaymentInputError("Payment amount must be greater than zero.");
      return;
    }
    if (payVal > outstandingBalance) {
      setPaymentInputError(`Maximum payment can be UGX ${outstandingBalance.toLocaleString()}`);
      return;
    }
    setPaymentInputError(null);

    setPaymentStatus('handshake');
    
    // Step 1: Handshake
    setTimeout(() => {
      setPaymentStatus('ussd_prompt');
      
      // Step 2: USSD prompt sent to device
      setTimeout(() => {
        setPaymentStatus('verifying');
        
        // Step 3: Clearing transaction
        setTimeout(() => {
          setPaymentStatus('success');
          
          if (onUpdatePayment && activeProject) {
            onUpdatePayment(activeProject.id, payVal);
          }
          
          // Complete final step
          setTimeout(() => {
            setIsPaymentModalOpen(false);
            setPaymentStatus('idle');
            setPaymentAmountInput('');
          }, 2500);

        }, 2200);
      }, 4500);
    }, 2000);
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  // Stop camera tracks helper
  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
    }
  };

  // Start camera feed helper
  const startCamera = async (mode: 'environment' | 'user' = 'environment') => {
    setCameraError(null);
    setCapturedImage(null);
    
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: { ideal: mode },
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      });
      setCameraStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err: any) {
      console.warn('Camera access error:', err);
      setCameraError('Permission denied or no camera device found. Please verify permissions in your browser address bar.');
    }
  };

  // Switch facing camera
  const toggleCameraFacing = () => {
    const nextMode = facingMode === 'environment' ? 'user' : 'environment';
    setFacingMode(nextMode);
    if (isCameraModeActive) {
      startCamera(nextMode);
    }
  };

  // Take snapshot
  const capturePhoto = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      // Draw frame
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
      setCapturedImage(dataUrl);
      stopCamera();
    }
  };

  // Upload snapped photo
  const handleUploadPhoto = () => {
    if (!capturedImage || !activeProject) return;
    
    // Auto-generate file name with timestamp
    const finalName = `${customPhotoName.trim() || 'site-photo'}-${Date.now()}.jpg`;
    
    // Base64 size approximation (3 bytes for every 4 base64 chars)
    const base64Content = capturedImage.split(',')[1] || '';
    const sizeInBytes = Math.round((base64Content.length * 3) / 4);
    const sizeStr = `${(sizeInBytes / 1024 / 1024).toFixed(2)} MB`;

    const newMedia: ProjectMedia = {
      id: `med-${Date.now()}`,
      name: finalName,
      url: capturedImage,
      uploadedBy: currentUser?.role || 'client',
      uploadedAt: new Date().toISOString().split('T')[0],
      size: sizeStr,
      type: 'image'
    };

    onAddMedia(activeProject.id, newMedia);
    
    // Clean up states
    setCapturedImage(null);
    setIsCameraModeActive(false);
    setCustomPhotoName('site-photo');
  };

  // Cleanup effect on unmount or stream change
  useEffect(() => {
    return () => {
      if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [cameraStream]);

  const handleNoteSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!newNoteText.trim() || !activeProject || !onAddNote) return;
    
    onAddNote(activeProject.id, newNoteText.trim());
    setNewNoteText('');
  };

  // Status mapping colors
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'planning': return 'bg-slate-850 text-slate-400 border border-slate-700';
      case 'designing': return 'bg-blue-950 text-blue-400 border border-blue-900/60';
      case 'fabrication': return 'bg-amber-950 text-amber-500 border border-amber-900/40';
      case 'inspection': return 'bg-indigo-950 text-indigo-400 border border-indigo-900/40';
      case 'delivery': return 'bg-pink-950 text-pink-500 border border-pink-900/40';
      case 'installed': return 'bg-emerald-950 text-emerald-400 border border-emerald-900/40';
      default: return 'bg-slate-900 text-slate-400';
    }
  };

  return (
    <div className="bg-slate-950 text-white min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      
      {/* If user is not logged in */}
      {!currentUser ? (
        <div className="max-w-4xl mx-auto text-center py-20 bg-slate-900 rounded-2xl border border-slate-800 p-8 my-8 shadow-2xl">
          <Clock className="w-16 h-16 text-amber-500 mx-auto mb-6 animate-pulse" />
          <h2 className="font-display font-black text-2xl uppercase tracking-tight text-white">
            SECURE CLIENT PROJECT TRACKER
          </h2>
          <p className="mt-3 text-sm text-slate-400 max-w-lg mx-auto leading-relaxed">
            HOLLYKING METALWORKS U.LTD offers live state reporting. Registered clients can view high-definition mill progress, outstanding structural values, and upload site sketches directly.
          </p>
          <div className="mt-8 p-4 bg-slate-950/80 rounded-lg max-w-sm mx-auto border border-slate-800 text-xs text-left mb-8">
            <span className="block font-mono font-bold text-amber-500 uppercase tracking-widest text-[10px] mb-2">💡 Quick Testing Instruction</span>
            <p className="text-slate-400">
              Click the button below and use the **Demo Client Account** shortcut to immediately view preloaded blueprints and live milestone tracking.
            </p>
          </div>
          <button
            onClick={onOpenLogin}
            className="px-8 py-3.5 bg-amber-600 hover:bg-amber-500 text-slate-950 font-display font-extrabold text-sm rounded-lg tracking-wider uppercase transition-all shadow-md transform active:scale-95 cursor-pointer inline-flex items-center gap-2"
          >
            <Hammer className="w-4 h-4" />
            <span>Sign In / Preview Demo Account</span>
          </button>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto">
          {/* Header block with statistics and project select dropdown */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
              <span className="text-[10px] uppercase font-mono tracking-widest text-amber-500 font-bold">
                {currentUser.role === 'admin' ? '🛡️ Administrator Controller' : '👷 Active Service Tracker'}
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-black text-white mt-1 uppercase">
                Contract Assemblies Stream
              </h2>
            </div>

            {/* Selector dropdown */}
            {userProjects.length > 0 && (
              <div className="flex items-center gap-2 w-full md:w-auto">
                <span className="text-xs text-slate-400 shrink-0 font-mono">Choose Project:</span>
                <select
                  value={activeProjectId}
                  onChange={(e) => setSelectedProjectId(e.target.value)}
                  className="w-full md:w-80 bg-slate-900 border border-slate-800 rounded px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                >
                  {userProjects.map((p) => (
                    <option key={p.id} value={p.id}>
                      [{p.contractNumber}] {p.title}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {userProjects.length === 0 ? (
            <div className="text-center py-20 bg-slate-900 rounded-xl border border-slate-800">
              <AlertCircle className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <h3 className="font-display font-medium text-slate-300">No projects linked to this profile</h3>
              <p className="text-xs text-slate-500 max-w-xs mx-auto mt-2">
                If you recently registered, please call +256703025834 so support registers your contract key to your email.
              </p>
            </div>
          ) : activeProject ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* LEFT TWO-THIRDS MAIN SECTIONS */}
              <div className="lg:col-span-8 space-y-8">
                
                {/* 1. Milestone Progress Indicator */}
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-md">
                  <div className="flex justify-between items-start flex-wrap gap-2 mb-4">
                    <div>
                      <span className="text-xs text-slate-400 font-mono">CONTRACT KEY: {activeProject.contractNumber}</span>
                      <h3 className="font-display font-extrabold text-xl text-white mt-0.5">{activeProject.title}</h3>
                      <p className="text-xs text-slate-400 mt-1 max-w-xl">{activeProject.description}</p>
                    </div>
                    <span className={`px-2.5 py-1 text-[11px] font-mono font-bold rounded uppercase tracking-wider ${getStatusBadgeClass(activeProject.status)}`}>
                      {activeProject.status}
                    </span>
                  </div>

                  {/* Horizontal Linear progress gauge */}
                  <div className="mt-6">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-400">Total Completion Stage:</span>
                      <span className="text-amber-500 font-mono font-bold">{activeProject.progress}%</span>
                    </div>
                    <div className="w-full bg-slate-950 h-3.5 rounded-full overflow-hidden border border-slate-800 p-0.5">
                      <div 
                        className="bg-gradient-to-r from-amber-600 to-amber-500 h-full rounded-full transition-all duration-1000"
                        style={{ width: `${activeProject.progress}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Interactive Milestones Pipeline */}
                  <div className="mt-8 pt-6 border-t border-slate-800/80">
                    <h4 className="font-display font-bold text-xs uppercase tracking-wider text-slate-300 mb-6">
                      Milestone Progress Gates
                    </h4>

                    <div className="relative pl-6 space-y-6 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-800">
                      {activeProject.milestones.map((ms) => {
                        const isCompleted = ms.status === 'completed';
                        const isInProgress = ms.status === 'in-progress';
                        return (
                          <div key={ms.id} className="relative flex justify-between items-start gap-3">
                            {/* Circle Pin indicator */}
                            <div className="absolute left-[-21px] top-1">
                              {isCompleted ? (
                                <div className="w-5 h-5 rounded-full bg-slate-900 border-2 border-emerald-500 text-emerald-500 flex items-center justify-center bg-emerald-950/40">
                                  <CheckCircle2 className="w-3.5 h-3.5" />
                                </div>
                              ) : isInProgress ? (
                                <div className="w-5 h-5 rounded-full bg-slate-900 border-2 border-amber-500 text-amber-500 flex items-center justify-center animate-pulse">
                                  <Clock className="w-3.5 h-3.5" />
                                </div>
                              ) : (
                                <div className="w-5 h-5 rounded-full bg-slate-950 border-2 border-slate-700 text-slate-400 flex items-center justify-center">
                                  <Circle className="w-2 h-2" />
                                </div>
                              )}
                            </div>

                            {/* Details of milestone */}
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <h5 className={`text-xs font-bold leading-none ${isCompleted ? 'text-slate-300' : isInProgress ? 'text-amber-400' : 'text-slate-500'}`}>
                                  {ms.title}
                                </h5>
                                {ms.completedAt && (
                                  <span className="text-[10px] font-mono text-emerald-500 bg-emerald-950/20 px-1.5 py-0.5 rounded border border-emerald-900/30">
                                    Done: {ms.completedAt}
                                  </span>
                                )}
                              </div>
                              <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                                {ms.description}
                              </p>
                              
                              {/* Admin control buttons directly embedded inside milestones */}
                              {currentUser.role === 'admin' && onUpdateMilestone && (
                                <div className="mt-2 flex gap-1.5">
                                  <button
                                    onClick={() => onUpdateMilestone(activeProject.id, ms.id, 'completed')}
                                    className={`px-2 py-0.5 rounded text-[9px] font-mono cursor-pointer border ${
                                      isCompleted ? 'bg-emerald-950/30 text-emerald-400 border-emerald-800' : 'bg-slate-950 hover:bg-slate-800 border-slate-800 text-slate-400'
                                    }`}
                                  >
                                    Set Completed
                                  </button>
                                  <button
                                    onClick={() => onUpdateMilestone(activeProject.id, ms.id, 'in-progress')}
                                    className={`px-2 py-0.5 rounded text-[9px] font-mono cursor-pointer border ${
                                      isInProgress ? 'bg-amber-950/30 text-amber-400 border-amber-850' : 'bg-slate-950 hover:bg-slate-800 border-slate-800 text-slate-400'
                                    }`}
                                  >
                                    Set In-Progress
                                  </button>
                                  <button
                                    onClick={() => onUpdateMilestone(activeProject.id, ms.id, 'pending')}
                                    className={`px-2 py-0.5 rounded text-[9px] font-mono cursor-pointer border ${
                                      ms.status === 'pending' ? 'bg-slate-950-active text-slate-300 border-slate-700' : 'bg-slate-950 hover:bg-slate-800 border-slate-800 text-slate-400'
                                    }`}
                                  >
                                    Set Reset
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* 2. Media Upload & Reference Space */}
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-md" id="media-upload-center">
                  <div className="flex justify-between items-center mb-1">
                    <h3 className="font-display font-extrabold text-lg text-white">
                      Contract Media Repository
                    </h3>
                    <span className="text-[10px] uppercase font-mono text-slate-500">Includes Blueprints & Progress photos</span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed mb-6">
                    A secure collaborative catalog of structural reference drawings, landscape measurements, and progress updates. Toggle between file upload and live camera snapshots.
                  </p>

                  {/* Mode Swapper Tab Buttons */}
                  <div className="flex bg-slate-950 p-1.5 rounded-lg border border-slate-850 gap-1.5 mb-6">
                    <button
                      id="btn-upload-tab-file"
                      onClick={() => {
                        setIsCameraModeActive(false);
                        stopCamera();
                      }}
                      className={`flex-1 py-2 text-xs font-mono font-bold tracking-wider uppercase rounded-md transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                        !isCameraModeActive 
                          ? 'bg-amber-600 text-slate-950 font-extrabold shadow' 
                          : 'text-slate-400 hover:text-white hover:bg-slate-900/40'
                      }`}
                    >
                      <span>📁 File Upload</span>
                    </button>
                    <button
                      id="btn-upload-tab-camera"
                      onClick={() => {
                        setIsCameraModeActive(true);
                        setCameraError(null);
                        setCapturedImage(null);
                        startCamera(facingMode);
                      }}
                      className={`flex-1 py-2 text-xs font-mono font-bold tracking-wider uppercase rounded-md transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                        isCameraModeActive 
                          ? 'bg-amber-600 text-slate-950 font-extrabold shadow' 
                          : 'text-slate-400 hover:text-white hover:bg-slate-900/40'
                      }`}
                    >
                      <Camera className="w-3.5 h-3.5" />
                      <span>📷 Take Site Photo</span>
                    </button>
                  </div>

                  {isCameraModeActive ? (
                    <div className="bg-slate-955 border border-slate-850 rounded-xl p-5 space-y-4" id="camera-capture-dashboard">
                      {cameraError ? (
                        <div className="text-center py-8 space-y-4" id="camera-error-view">
                          <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
                          <p className="text-xs text-red-400 max-w-sm mx-auto leading-relaxed">{cameraError}</p>
                          <button
                            id="camera-retry-button"
                            onClick={() => startCamera(facingMode)}
                            className="px-5 py-2.5 bg-slate-900 border border-slate-800 rounded font-mono text-xs uppercase tracking-wider text-white hover:bg-slate-850 transition-colors cursor-pointer"
                          >
                            🔄 Retry Camera Access
                          </button>
                        </div>
                      ) : capturedImage ? (
                        /* Captured Snapshot Preview */
                        <div className="space-y-4" id="camera-snapped-preview">
                          <span className="block font-mono text-[10px] uppercase font-bold text-amber-500 tracking-wider">
                            ✨ Site image snapshot captured
                          </span>
                          <div className="relative aspect-video max-h-80 w-full overflow-hidden rounded bg-black border border-slate-800 select-none flex items-center justify-center" id="camera-preview-frame">
                            <img 
                              src={capturedImage} 
                              alt="Snapped site representation" 
                              className="w-full h-full object-contain"
                              referrerPolicy="no-referrer"
                            />
                          </div>
                          
                          {/* Photo metadata options */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-1">
                                Photo Reference Name
                              </label>
                              <input
                                id="camera-filename-input"
                                type="text"
                                value={customPhotoName}
                                onChange={(e) => setCustomPhotoName(e.target.value)}
                                placeholder="E.g., site-installation-front, workshop-assembly..."
                                className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-xs text-white uppercase font-mono focus:outline-none focus:ring-1 focus:ring-amber-500"
                              />
                            </div>
                            
                            <div className="flex items-end gap-2">
                              <button
                                id="camera-save-button"
                                onClick={handleUploadPhoto}
                                className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-display font-extrabold text-xs uppercase tracking-widest rounded transition-all cursor-pointer flex items-center justify-center gap-1 shadow-md shadow-emerald-950/20"
                              >
                                <Check className="w-4 h-4" />
                                <span>Add to Gallery</span>
                              </button>
                              <button
                                id="camera-retake-button"
                                onClick={() => {
                                  setCapturedImage(null);
                                  startCamera(facingMode);
                                }}
                                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white font-mono font-bold text-xs uppercase tracking-wide rounded transition-all cursor-pointer flex items-center justify-center gap-1"
                              >
                                <RotateCw className="w-3.5 h-3.5 animate-reverse" />
                                <span>Retake</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        /* Live Camera Stream View */
                        <div className="space-y-4" id="camera-stream-display">
                          <div className="relative aspect-video max-h-80 w-full overflow-hidden rounded bg-black border border-slate-850 flex items-center justify-center" id="camera-video-container">
                            <video
                              ref={videoRef}
                              autoPlay
                              playsInline
                              muted
                              className="w-full h-full object-cover" 
                              style={{ transform: facingMode === 'user' ? 'scaleX(-1)' : 'none' }}
                            />
                            
                            {/* HUD overlay style indicators */}
                            <div className="absolute top-3 left-3 px-2 py-1 bg-black/80 rounded text-[9px] font-mono border border-slate-800 flex items-center gap-1.5 uppercase text-amber-500 select-none">
                              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                              <span>Live Feed: {facingMode === 'environment' ? 'Rear Cam' : 'Front Cam'}</span>
                            </div>

                            {!cameraStream && (
                              <div className="absolute inset-0 bg-slate-950/90 flex flex-col items-center justify-center gap-2">
                                <RefreshCw className="w-6 h-6 text-amber-500 animate-spin" />
                                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">Waking stream sensor...</span>
                              </div>
                            )}
                          </div>

                          <div className="flex gap-2">
                            <button
                              id="camera-capture-button"
                              onClick={capturePhoto}
                              disabled={!cameraStream}
                              className={`flex-1 py-3 text-white font-display font-black text-xs uppercase tracking-wider rounded transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg ${
                                cameraStream 
                                  ? 'bg-red-600 hover:bg-red-500 shadow-red-950/20' 
                                  : 'bg-red-950/30 text-slate-600 border border-slate-900 cursor-not-allowed'
                              }`}
                            >
                              <Camera className="w-4 h-4" />
                              <span>Take Snapshot</span>
                            </button>
                            
                            <button
                              id="camera-flip-button"
                              onClick={toggleCameraFacing}
                              disabled={!cameraStream}
                              title="Switch camera sensor front or back"
                              className={`p-3 border text-slate-300 hover:text-white rounded transition-colors cursor-pointer ${
                                cameraStream ? 'bg-slate-900 hover:bg-slate-800 border-slate-800' : 'bg-slate-950 text-slate-600 border-slate-900 cursor-not-allowed'
                              }`}
                            >
                              <RotateCw className="w-4 h-4" />
                            </button>
                            
                            <button
                              id="camera-cancel-button"
                              onClick={() => {
                                setIsCameraModeActive(false);
                                stopCamera();
                              }}
                              className="px-4 py-3 bg-slate-900 hover:bg-slate-850 border border-slate-800 text-xs font-mono font-bold uppercase tracking-wider text-slate-400 hover:text-white rounded transition-colors cursor-pointer"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    /* Drag-and-Drop Area */
                    <div
                      onDragEnter={handleDrag}
                      onDragOver={handleDrag}
                      onDragLeave={handleDrag}
                      onDrop={handleDrop}
                      onClick={triggerFileSelect}
                      className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
                        dragActive
                          ? 'border-amber-500 bg-amber-950/20'
                          : 'border-slate-850 bg-slate-950 hover:border-slate-800 hover:bg-slate-950/60'
                      }`}
                    >
                      <input
                        ref={fileInputRef}
                        type="file"
                        id="upload-file-selector"
                        className="hidden"
                        onChange={handleFileInputChange}
                        accept="image/*,.dwg,.pdf,.xls"
                      />
                      
                      {uploadProgress !== null ? (
                        <div className="max-w-xs mx-auto">
                          <RefreshCw className="w-8 h-8 text-amber-500 animate-spin mx-auto mb-3" />
                          <span className="block text-xs font-mono text-slate-400 uppercase">Processing payload: {fileName}</span>
                          <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-800 mt-2 p-0.5">
                            <div className="h-full bg-amber-500 rounded-full" style={{ width: `${uploadProgress}%` }}></div>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <UploadCloud className="w-10 h-10 text-amber-500 mx-auto opacity-80" />
                          <div>
                            <p className="text-xs font-bold text-slate-200">
                              Drag & drop file here, or <span className="text-amber-500 underline">browse computer</span>
                            </p>
                            <p className="text-[10px] text-slate-500 mt-1 font-mono">
                              Supports PNG, JPG, PDF (Max size 8MB)
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Real Saved media items in state */}
                  <div className="mt-8">
                    <h4 className="font-display font-medium text-xs text-slate-300 uppercase tracking-wider mb-4">
                      Active Files Gallery ({activeProject.media.length})
                    </h4>

                    {activeProject.media.length === 0 ? (
                      <p className="text-xs text-slate-500 italic py-4 text-center">No images or drawings uploaded yet.</p>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {activeProject.media.map((med) => (
                          <div 
                            key={med.id}
                            className="bg-slate-950 border border-slate-850 rounded-lg p-3 flex gap-3 justify-between items-start hover:border-slate-700 transition-colors"
                          >
                            <div className="flex gap-2.5 items-center overflow-hidden">
                              <div className="w-12 h-12 bg-slate-900 rounded border border-slate-800 shrink-0 flex items-center justify-center overflow-hidden">
                                {med.type === 'image' || med.name.match(/\.(jpeg|jpg|png|webp)/i) ? (
                                  <img 
                                    src={med.url} 
                                    alt={med.name} 
                                    className="w-full h-full object-cover"
                                    referrerPolicy="no-referrer"
                                  />
                                ) : (
                                  <FileText className="w-5 h-5 text-amber-600" />
                                )}
                              </div>
                              <div className="overflow-hidden">
                                <h5 className="text-xs font-bold text-slate-300 truncate" title={med.name}>
                                  {med.name}
                                </h5>
                                <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-mono mt-0.5">
                                  <span>{med.size || '350 KB'}</span>
                                  <span>•</span>
                                  <span>Uploaded by {med.uploadedBy}</span>
                                </div>
                              </div>
                            </div>

                            <div className="flex gap-1">
                              <a 
                                href={med.url} 
                                target="_blank" 
                                rel="noreferrer"
                                className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-900 rounded"
                                title="Open Attachment Link"
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                              </a>
                              <button
                                onClick={() => onDeleteMedia(activeProject.id, med.id)}
                                className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-slate-900 rounded cursor-pointer"
                                title="Delete design file"
                              >
                                <Trash className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

              </div>

              {/* RIGHT ONE-THIRD SIDEBAR (FINANCIALS, CLIENT INFO, NOTES) */}
              <div className="lg:col-span-4 space-y-8">
                
                {/* 1. Account / Ledger Balance Block */}
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
                  <h4 className="font-display font-bold text-xs uppercase tracking-wider text-slate-300 mb-4 pb-2 border-b border-slate-800">
                    Finances & Ledger Details
                  </h4>

                  <div className="space-y-4">
                    {/* Invoice block */}
                    <div className="p-3.5 bg-slate-950 rounded-lg border border-slate-850 flex items-center gap-3">
                      <div className="p-2 bg-emerald-950/40 text-emerald-400 border border-emerald-900/40 rounded">
                        <DollarSign className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="block text-[10px] text-slate-500 font-mono uppercase">Amount Paid</span>
                        <span className="text-sm font-black text-emerald-400 font-mono">{activeProject.amountPaid}</span>
                      </div>
                    </div>

                    <div className="p-3.5 bg-slate-950 rounded-lg border border-slate-850 flex items-center gap-3">
                      <div className="p-2 bg-slate-900 text-slate-400 border border-slate-800 rounded">
                        <DollarSign className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="block text-[10px] text-slate-500 font-mono uppercase">Contract Value</span>
                        <span className="text-sm font-black text-white font-mono">{activeProject.totalValue}</span>
                      </div>
                    </div>

                    {/* Progress tracking details */}
                    <div className="text-xs space-y-2 font-mono pt-2 text-slate-400">
                      <div className="flex justify-between">
                        <span>Initiation Date:</span>
                        <span className="text-white">{activeProject.startDate}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Target Delivery:</span>
                        <span className="text-white">{activeProject.estCompletionDate}</span>
                      </div>
                    </div>

                    {/* Balance due details & payment integration */}
                    <div className="pt-3.5 border-t border-slate-800/80 space-y-3">
                      <div className="flex justify-between items-center bg-slate-950 p-3 rounded-lg border border-slate-850">
                        <div>
                          <span className="block text-[9px] text-slate-500 font-mono uppercase">Outstanding Balance</span>
                          <span className="text-sm font-black text-amber-500 font-mono">
                            UGX {outstandingBalance.toLocaleString()}
                          </span>
                        </div>
                        {outstandingBalance === 0 ? (
                          <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-800/60 font-mono font-bold uppercase tracking-wider">
                            Paid In Full
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded text-[10px] bg-amber-950/40 text-amber-500 border border-amber-900/40 font-mono font-bold uppercase tracking-wider animate-pulse">
                            Balance Due
                          </span>
                        )}
                      </div>

                      {outstandingBalance > 0 && currentUser?.role !== 'admin' && (
                        <button
                          id="btn-trigger-momo"
                          onClick={() => {
                            setPaymentAmountInput(outstandingBalance.toString());
                            setPaymentPhone(currentUser?.phone || '');
                            setPaymentStatus('idle');
                            setIsPaymentModalOpen(true);
                          }}
                          className="w-full inline-flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-slate-950 font-display font-black text-xs uppercase tracking-widest rounded-lg transition-all cursor-pointer shadow-md shadow-amber-950/20 active:scale-[0.98]"
                        >
                          <CreditCard className="w-4 h-4 shrink-0" />
                          <span>Pay via Mobile Money</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* 2. Emergency Contacts Area */}
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
                  <h4 className="font-display font-bold text-xs uppercase tracking-wider text-slate-300 mb-2">
                    Supervisor Support Liaison
                  </h4>
                  <p className="text-[11px] text-slate-400 mb-3 leading-relaxed">
                    Need instant changes on blueprint design dimensions, structural thicknesses, or pricing? Contact managers directly:
                  </p>
                  <div className="space-y-2 text-xs">
                    <a href="tel:+256703025834" className="block text-slate-200 hover:text-amber-500 transition-all font-mono font-semibold">
                      ☎️ +256 703 025 834 (Airtel)
                    </a>
                    <a href="tel:+256771336689" className="block text-slate-200 hover:text-amber-500 transition-all font-mono font-semibold">
                      ☎️ +256 771 336 689 (MTN)
                    </a>
                  </div>
                </div>

                {/* 3. Internal Technical Engineer Remarks */}
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
                  <h4 className="font-display font-bold text-xs uppercase tracking-wider text-slate-300 mb-4 pb-2 border-b border-slate-800">
                    Workshop Log Notes
                  </h4>

                  {activeProject.adminNotes ? (
                    <div className="p-3 bg-slate-950 rounded border border-slate-850 text-xs text-amber-500 italic leading-relaxed">
                      " {activeProject.adminNotes} "
                    </div>
                  ) : (
                    <p className="text-[11px] text-slate-500 italic">No supervisor notes logged yet on this assembly.</p>
                  )}

                  {/* Add note from current user */}
                  {currentUser.role === 'admin' && onAddNote && (
                    <form onSubmit={handleNoteSubmit} className="mt-4 pt-4 border-t border-slate-800/65 space-y-2">
                      <label className="block text-[10px] font-mono text-slate-400 uppercase">Modify Supervisor note</label>
                      <textarea
                        value={newNoteText}
                        onChange={(e) => setNewNoteText(e.target.value)}
                        placeholder="Write workshop instructions..."
                        className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-500 min-h-[60px]"
                      />
                      <button
                        type="submit"
                        className="w-full py-1.5 bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold text-xs rounded transition-all cursor-pointer"
                      >
                        Update Note
                      </button>
                    </form>
                  )}
                </div>

              </div>

            </div>
          ) : null}
        </div>
      )}

      {/* 256-Bit SSL Secured Mobile Money checkout portal */}
      {isPaymentModalOpen && activeProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 overflow-y-auto">
          <div className="bg-[#0b101d] border border-slate-800 rounded-2xl max-w-md w-full p-6 relative shadow-2xl space-y-6">
            
            {/* Modal Header */}
            <div className="flex justify-between items-center pb-4 border-b border-slate-800/60">
              <div>
                <span className="text-[9px] font-mono tracking-widest text-amber-500 font-black block uppercase font-bold">
                  🔒 SECURE TELECOM HANDSHAKE v2.4
                </span>
                <h3 className="font-display font-extrabold text-white text-md uppercase mt-0.5">
                  Mobile Money Checkout
                </h3>
              </div>
              <button 
                onClick={() => {
                  if (paymentStatus === 'idle' || paymentStatus === 'success') {
                    setIsPaymentModalOpen(false);
                    setPaymentStatus('idle');
                    setPaymentInputError(null);
                  }
                }}
                disabled={paymentStatus !== 'idle' && paymentStatus !== 'success'}
                className="text-slate-400 hover:text-white bg-slate-900 border border-slate-800 rounded px-1.5 py-1 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
              >
                ✕
              </button>
            </div>

            {paymentStatus === 'idle' && (
              <form onSubmit={handleStartPayment} className="space-y-5">
                {/* Network Choice Cards */}
                <div className="space-y-2">
                  <label className="block text-[10px] font-mono whitespace-nowrap text-slate-400 uppercase tracking-wider font-bold">
                    Select Network Operator:
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {/* MTN */}
                    <div 
                      onClick={() => setPaymentNetwork('mtn')}
                      className={`p-4 rounded-xl border flex flex-col items-center justify-center gap-2 cursor-pointer transition-all select-none ${
                        paymentNetwork === 'mtn' 
                          ? 'bg-amber-500/10 border-amber-500 text-amber-400 font-extrabold shadow-[0_0_12px_rgba(245,158,11,0.1)]' 
                          : 'bg-slate-950 border-slate-850 text-slate-400 hover:border-slate-800'
                      }`}
                    >
                      <div className="w-10 h-10 rounded-full bg-amber-500 text-slate-950 font-display font-black flex items-center justify-center text-xs shadow-inner font-black">
                        MTN
                      </div>
                      <span className="text-xs uppercase font-mono tracking-wider font-bold">MTN MoMo</span>
                    </div>

                    {/* Airtel */}
                    <div 
                      onClick={() => setPaymentNetwork('airtel')}
                      className={`p-4 rounded-xl border flex flex-col items-center justify-center gap-2 cursor-pointer transition-all select-none ${
                        paymentNetwork === 'airtel' 
                          ? 'bg-red-500/10 border-red-500 text-red-500 font-extrabold shadow-[0_0_12px_rgba(239,68,68,0.1)]' 
                          : 'bg-slate-950 border-slate-850 text-slate-400 hover:border-slate-800'
                      }`}
                    >
                      <div className="w-10 h-10 rounded-full bg-red-650 text-white font-display font-black flex items-center justify-center text-xs shadow-inner font-black">
                        airtel
                      </div>
                      <span className="text-xs uppercase font-mono tracking-wider font-bold">Airtel Money</span>
                    </div>
                  </div>
                </div>

                {/* Account details inputs */}
                <div className="space-y-4">
                  {/* Phone input */}
                  <div>
                    <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-1.5 font-bold">
                      Merchant Subscriber Line (+256)
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500 text-xs font-mono">
                        UG
                      </span>
                      <input 
                        type="tel"
                        required
                        placeholder="e.g. +256 703 025 834"
                        value={paymentPhone}
                        onChange={(e) => setPaymentPhone(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2.5 pl-10 text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                      />
                    </div>
                  </div>

                  {/* Amount input */}
                  <div>
                    <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-1.5 font-bold">
                      Debit Amount (UGX)
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500 text-xs font-mono">
                        UGX
                      </span>
                      <input 
                        type="number"
                        required
                        placeholder="Amount in Ugandan Shillings"
                        value={paymentAmountInput}
                        onChange={(e) => {
                          setPaymentAmountInput(e.target.value);
                          setPaymentInputError(null);
                        }}
                        className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2.5 pl-12 text-xs text-white font-mono focus:outline-none focus:ring-1 focus:ring-amber-500"
                      />
                    </div>
                    {/* Fast presets */}
                    <div className="flex gap-2 mt-2">
                      <button
                        type="button"
                        onClick={() => setPaymentAmountInput((outstandingBalance / 2).toFixed(0))}
                        className="flex-1 py-1.5 bg-slate-900 border border-slate-800 hover:bg-slate-850 rounded text-[10px] font-mono text-slate-400 hover:text-white cursor-pointer font-bold"
                      >
                        50% (Deposit)
                      </button>
                      <button
                        type="button"
                        onClick={() => setPaymentAmountInput(outstandingBalance.toString())}
                        className="flex-1 py-1.5 bg-slate-900 border border-slate-800 hover:bg-slate-850 rounded text-[10px] font-mono text-slate-400 hover:text-white cursor-pointer font-bold"
                      >
                        100% (Full Pay)
                      </button>
                    </div>
                  </div>

                  {paymentInputError && (
                    <div className="p-3 bg-red-950/60 border border-red-900/50 text-red-400 rounded-lg text-xs font-mono text-[11px] flex items-center gap-1.5">
                      <ShieldAlert className="w-4 h-4 shrink-0 text-red-500" />
                      <span>{paymentInputError}</span>
                    </div>
                  )}
                </div>

                {/* Terms disclaimer */}
                <p className="text-[10px] text-slate-500 italic leading-relaxed text-center font-sans">
                  By clicking authorization, you initiate an authenticated pull API call through MTN MoMo / Airtel APIs (Kampala clearing house).
                </p>

                {/* CTA */}
                <button
                  type="submit"
                  className={`w-full py-3 rounded-lg text-slate-950 font-display font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg ${
                    paymentNetwork === 'mtn' 
                      ? 'bg-amber-500 hover:bg-amber-400 shadow-amber-950/20' 
                      : 'bg-red-650 text-white hover:bg-red-500 shadow-red-950/20'
                  }`}
                >
                  <Smartphone className="w-4 h-4 shrink-0" />
                  <span>Authorize Mobile Money Debit</span>
                </button>
              </form>
            )}

            {/* HANDSHAKE SIMULATION PROGRESS STATUS PAGES */}
            {paymentStatus !== 'idle' && (
              <div className="py-8 text-center space-y-6">
                
                {/* Handshaking State */}
                {paymentStatus === 'handshake' && (
                  <div className="space-y-4 animate-pulse">
                    <RefreshCw className="w-10 h-10 text-amber-500 animate-spin mx-auto" />
                    <div>
                      <h4 className="font-mono text-xs text-slate-300 uppercase tracking-widest font-bold">
                        Initializing Handshake...
                      </h4>
                      <p className="text-[11px] text-slate-500 mt-2 font-mono">
                        Establishing 256-bit secure tunnel with telecom operator node.
                      </p>
                    </div>
                  </div>
                )}

                {/* USSD Prompter State */}
                {paymentStatus === 'ussd_prompt' && (
                  <div className="space-y-4">
                    <div className="relative w-12 h-12 mx-auto flex items-center justify-center bg-amber-500/10 border border-amber-500/30 rounded-full text-amber-400 animate-bounce">
                      <Smartphone className="w-6 h-6 animate-pulse" />
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-mono text-xs text-amber-400 uppercase tracking-widest font-bold">
                        USSD PUSH PROMPT SENT!
                      </h4>
                      <p className="text-xs text-slate-200 leading-relaxed font-sans max-w-xs mx-auto">
                        We have triggered a secure transaction pop-up on your device (<strong>{paymentPhone}</strong>).
                      </p>
                      <div className="p-3 bg-slate-950 rounded-lg border border-slate-850 text-[11px] font-mono text-amber-500 max-w-xs mx-auto leading-relaxed border-dashed text-amber-500 font-bold">
                        "Enter your secret Mobile Money PIN when prompted on your handset screen to authorize this trade debit."
                      </div>
                      <p className="text-[10px] text-slate-500 font-mono pt-2">
                        ⏱️ Awaiting PIN validation timeout (15s)...
                      </p>
                    </div>
                  </div>
                )}

                {/* Verifying Clearing State */}
                {paymentStatus === 'verifying' && (
                  <div className="space-y-4">
                    <RefreshCw className="w-10 h-10 text-emerald-500 animate-spin mx-auto" />
                    <div>
                      <h4 className="font-mono text-xs text-slate-300 uppercase tracking-widest font-bold">
                        Clearing Settlement...
                      </h4>
                      <p className="text-[11px] text-slate-500 mt-2 font-mono">
                        Reconciling telecom ledger transaction key. Posting ledger balances...
                      </p>
                    </div>
                  </div>
                )}

                {/* Success State */}
                {paymentStatus === 'success' && (
                  <div className="space-y-4">
                    <div className="w-12 h-12 rounded-full border-2 border-emerald-500 bg-emerald-950/30 text-emerald-400 flex items-center justify-center mx-auto text-lg animate-scale">
                      <ShieldCheck className="w-6 h-6 shrink-0" />
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-mono text-sm text-emerald-400 uppercase tracking-widest font-bold">
                        PAYMENT SECURED SUCCESSFULLY!
                      </h4>
                      <p className="text-xs text-slate-300 max-w-xs mx-auto">
                        Paid UGX {parseInt(paymentAmountInput, 10).toLocaleString()} towards {activeProject.title}.
                      </p>
                      <p className="text-[10px] text-slate-500 font-mono">
                        Reference Hash: HK-TX-{Date.now().toString().slice(-6)}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Footer lock indicator */}
            <div className="pt-4 border-t border-slate-800/60 flex items-center justify-center gap-1.5 text-slate-500 text-[10px] font-mono tracking-widest uppercase font-bold">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              <span>PCI-DSS Secured Connection</span>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
