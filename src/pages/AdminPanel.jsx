import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit, Trash2, Save, X, Search } from 'lucide-react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// ----------------- Top Header -----------------
const TopHeader = ({ onLogout }) => (
  <header className="bg-black text-white px-6 py-4 flex justify-between items-center border-b border-gray-800">
    <h1 className="text-3xl font-bold">
      <span className="text-cyan-400">VOID</span>{' '}
      <span className="text-blue-500">CITY</span>{' '}
      <span className="text-gray-400 text-lg ml-2">Admin Panel</span>
    </h1>
    <div className="flex items-center space-x-4">
      <span className="text-gray-300 text-sm">Welcome, Admin</span>
      <button
        onClick={onLogout}
        className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-sm font-medium transition-colors"
      >
        Logout
      </button>
    </div>
  </header>
);

// ----------------- Navigation Tabs -----------------
const NavigationTabs = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'serials', label: 'Manage Serials' },
    { id: 'episodes', label: 'Manage Episodes' },
  ];

  return (
    <nav className="bg-gray-900 px-6 py-4 border-b border-gray-800">
      <div className="flex space-x-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded font-medium transition-colors ${
              activeTab === tab.id
                ? 'bg-cyan-600 text-white'
                : 'text-gray-400 hover:text-white hover:bg-gray-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </nav>
  );
};

// ----------------- Serial Form Modal -----------------
const SerialFormModal = ({ isOpen, onClose, serial, onSave, mode = 'add' }) => {
  const [formData, setFormData] = useState({
    name: serial?.name || '',
    description: serial?.description || '',
    genre: serial?.genre || '',
    status: serial?.status || 'active',
    blogUrl: serial?.blogUrl || '',
    image: serial?.image || '',
    imageFile: null,
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, imageFile: file }));
      toast.info(`Selected image: ${file.name}`);
    }
  };

  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      toast.error('Serial name is required');
      return;
    }
    setIsLoading(true);

    try {
      const token = localStorage.getItem('jwtToken');
      const config = { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' } };

      const payload = new FormData();
      payload.append('name', formData.name);
      payload.append('description', formData.description);
      payload.append('genre', formData.genre);
      payload.append('status', formData.status);
      payload.append('blogUrl', formData.blogUrl);
      if (formData.imageFile) payload.append('image', formData.imageFile);

      let response;
      if (mode === 'add') {
        response = await axios.post('https://illegal-backend.vercel.app/api/serials', payload, config);
      } else {
        response = await axios.put(
          `https://illegal-backend.vercel.app/api/serials/${serial._id}`,
          payload,
          config
        );
      }

      onSave({ ...response.data.data, episodes: serial?.episodes || [] });
      toast.success(mode === 'add' ? 'Serial added successfully' : 'Serial updated successfully');
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.msg || 'Failed to save serial');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-900 rounded-lg p-6 w-full max-w-md border border-gray-700">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-white">{mode === 'add' ? 'Add New Serial' : 'Edit Serial'}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white"><X className="w-5 h-5"/></button>
        </div>

        <div className="space-y-4">
          <input
            type="text"
            placeholder="Serial Name"
            value={formData.name}
            onChange={e => setFormData({...formData, name: e.target.value})}
            className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
          />
          <textarea
            placeholder="Description"
            value={formData.description}
            onChange={e => setFormData({...formData, description: e.target.value})}
            className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white h-20 focus:outline-none focus:ring-2 focus:ring-cyan-400"
          />
          <input
            type="text"
            placeholder="Genre"
            value={formData.genre}
            onChange={e => setFormData({...formData, genre: e.target.value})}
            className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
          />
          <select
            value={formData.status}
            onChange={e => setFormData({...formData, status: e.target.value})}
            className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="completed">Completed</option>
          </select>
          <input
            type="url"
            placeholder="Blog URL"
            value={formData.blogUrl}
            onChange={e => setFormData({...formData, blogUrl: e.target.value})}
            className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
          />
          <div className="flex space-x-2 items-center">
            <input type="file" accept="image/*" onChange={handleImageChange} className="flex-1 bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white"/>
            {formData.imageFile ? (
              <img src={URL.createObjectURL(formData.imageFile)} alt="Preview" className="w-16 h-16 object-cover rounded"/>
            ) : formData.image ? (
              <img src={formData.image} alt="Preview" className="w-16 h-16 object-cover rounded"/>
            ) : null}
          </div>
        </div>

        <div className="flex space-x-3 mt-6">
          <button
            onClick={handleSubmit}
            disabled={isLoading || !formData.name.trim()}
            className="flex-1 bg-cyan-600 hover:bg-cyan-700 disabled:bg-gray-600 text-white py-2 px-4 rounded font-medium transition-colors"
          >
            <Save className="w-4 h-4 inline mr-2"/>
            {isLoading ? 'Saving...' : mode === 'add' ? 'Add Serial' : 'Update Serial'}
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded font-medium transition-colors"
          >Cancel</button>
        </div>
      </div>
    </div>
  );
};

// ----------------- Episode Form Modal -----------------
const EpisodeFormModal = ({ isOpen, onClose, episode, serials, onSave, mode='add' }) => {
  const [formData, setFormData] = useState({
    title: episode?.title || '',
    episodeNo: episode?.episodeNo || '',
    description: episode?.description || '',
    redirectUrl: episode?.redirectUrl || '',
    serialId: episode?.serialId || serials[0]?._id || '',
    duration: episode?.duration || '',
    date: episode?.date || new Date().toLocaleDateString('en-GB'),
    image: episode?.image || '',
    imageFile: null
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleImageChange = e => {
    const file = e.target.files[0];
    if(file) setFormData(prev=>({...prev, imageFile:file}));
  };

  const handleSubmit = async () => {
    if(!formData.title.trim() || !formData.serialId){
      toast.error('Episode title and serial are required');
      return;
    }

    setIsLoading(true);
    try{
      const token = localStorage.getItem('jwtToken');
      const config = { headers: { Authorization:`Bearer ${token}`, 'Content-Type':'multipart/form-data' } };
      const payload = new FormData();
      payload.append('title', formData.title);
      payload.append('episodeNo', formData.episodeNo);
      payload.append('description', formData.description);
      payload.append('redirectUrl', formData.redirectUrl);
      payload.append('serialId', formData.serialId);
      if(formData.imageFile) payload.append('image', formData.imageFile);

      let response;
      if(mode==='add'){
        response = await axios.post(
          `https://illegal-backend.vercel.app/api/serials/${formData.serialId}/episodes`,
          payload,
          config
        );
      } else {
        response = await axios.put(
          `https://illegal-backend.vercel.app/api/serials/episodes/${episode._id}`,
          payload,
          config
        );
      }
      onSave({ ...response.data.data, duration: formData.duration, date: formData.date });
      toast.success(mode==='add'?'Episode added successfully':'Episode updated successfully');
      onClose();
    } catch(err){
      toast.error(err.response?.data?.msg || 'Failed to save episode');
    } finally {
      setIsLoading(false);
    }
  };

  if(!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-900 rounded-lg p-6 w-full max-w-lg border border-gray-700 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-white">{mode==='add'?'Add New Episode':'Edit Episode'}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white"><X className="w-5 h-5"/></button>
        </div>

        <div className="space-y-4">
          <select value={formData.serialId} onChange={e=>setFormData({...formData, serialId:e.target.value})}
            className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400">
            {serials.map(s=> <option key={s._id} value={s._id}>{s.name}</option>)}
          </select>

          <input type="text" placeholder="Episode Title" value={formData.title}
            onChange={e=>setFormData({...formData, title:e.target.value})}
            className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"/>
          <input type="number" placeholder="Episode No" value={formData.episodeNo}
            onChange={e=>setFormData({...formData, episodeNo:e.target.value})}
            className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"/>
          <input type="text" placeholder="Duration" value={formData.duration}
            onChange={e=>setFormData({...formData, duration:e.target.value})}
            className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"/>
          <input type="text" placeholder="Air Date" value={formData.date}
            onChange={e=>setFormData({...formData, date:e.target.value})}
            className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"/>
          <textarea placeholder="Description" value={formData.description}
            onChange={e=>setFormData({...formData, description:e.target.value})}
            className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white h-20 focus:outline-none focus:ring-2 focus:ring-cyan-400"/>
          <input type="url" placeholder="Redirect URL" value={formData.redirectUrl}
            onChange={e=>setFormData({...formData, redirectUrl:e.target.value})}
            className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"/>
          <div className="flex space-x-2 items-center">
            <input type="file" accept="image/*" onChange={handleImageChange} className="flex-1 bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white"/>
            {formData.imageFile ? (
              <img src={URL.createObjectURL(formData.imageFile)} alt="Preview" className="w-16 h-16 object-cover rounded"/>
            ) : formData.image ? (
              <img src={formData.image} alt="Preview" className="w-16 h-16 object-cover rounded"/>
            ) : null}
          </div>
        </div>

        <div className="flex space-x-3 mt-6">
          <button onClick={handleSubmit} disabled={isLoading || !formData.title.trim() || !formData.serialId}
            className="flex-1 bg-cyan-600 hover:bg-cyan-700 disabled:bg-gray-600 text-white py-2 px-4 rounded font-medium transition-colors">
            <Save className="w-4 h-4 inline mr-2"/>
            {isLoading ? 'Saving...' : mode==='add'?'Add Episode':'Update Episode'}
          </button>
          <button onClick={onClose} className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded font-medium transition-colors">Cancel</button>
        </div>
      </div>
    </div>
  );
};

// ----------------- Serials Management -----------------
const SerialsManagement = ({ serials, onAddSerial, onEditSerial, onDeleteSerial }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingSerial, setEditingSerial] = useState(null);
  const [modalMode, setModalMode] = useState('add');

  const filtered = serials.filter(s=>s.name.toLowerCase().includes(searchTerm.toLowerCase()));

  const handleAdd = () => { setEditingSerial(null); setModalMode('add'); setShowModal(true); };
  const handleEdit = (s) => { setEditingSerial(s); setModalMode('edit'); setShowModal(true); };

  const handleDelete = async (id)=>{
    if(!window.confirm('Delete this serial and its episodes?')) return;
    try{
      const token = localStorage.getItem('jwtToken');
      await axios.delete(`https://illegal-backend.vercel.app/api/serials/${id}`, { headers:{Authorization:`Bearer ${token}`}});
      onDeleteSerial(id);
      toast.success('Deleted successfully');
    }catch(err){toast.error(err.response?.data?.msg||'Failed to delete');}
  };

  const handleSave = (data)=>{ modalMode==='add'?onAddSerial(data):onEditSerial(data); };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">Manage Serials</h2>
        <button onClick={handleAdd} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded font-medium flex items-center">
          <Plus className="w-4 h-4 mr-2"/> Add Serial
        </button>
      </div>

      <input type="text" placeholder="Search..." value={searchTerm}
        onChange={e=>setSearchTerm(e.target.value)}
        className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white mb-4 focus:outline-none focus:ring-2 focus:ring-cyan-400"/>

      <div className="grid gap-4">
        {filtered.length===0? <p className="text-gray-400">No serials found.</p> : filtered.map(s=>(
          <div key={s._id} className="bg-gray-800 border border-gray-700 rounded-lg p-4 flex justify-between items-start">
            <div>
              <h3 className="text-xl font-semibold text-white">{s.name}</h3>
              <p className="text-gray-400">{s.description}</p>
              <div className="flex space-x-2 text-sm text-gray-300">
                <span>Genre: {s.genre||'N/A'}</span>
                <span>Status: {s.status||'N/A'}</span>
                <span>{s.episodes?.length||0} episodes</span>
              </div>
            </div>
            <div className="flex space-x-2">
              <button onClick={()=>handleEdit(s)} className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded"><Edit className="w-4 h-4"/></button>
              <button onClick={()=>handleDelete(s._id)} className="bg-red-600 hover:bg-red-700 text-white p-2 rounded"><Trash2 className="w-4 h-4"/></button>
            </div>
          </div>
        ))}
      </div>

      <SerialFormModal isOpen={showModal} onClose={()=>setShowModal(false)} serial={editingSerial} onSave={handleSave} mode={modalMode}/>
    </div>
  );
};

// ----------------- Episodes Management -----------------
const EpisodesManagement = ({ serials, onAddEpisode, onEditEpisode, onDeleteEpisode }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSerial, setSelectedSerial] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editingEpisode, setEditingEpisode] = useState(null);
  const [modalMode, setModalMode] = useState('add');

  const allEpisodes = serials.flatMap(s=> (s.episodes||[]).map(e=>({...e, serialTitle:s.name, serialId:s._id})));

  const filtered = allEpisodes.filter(e=>{
    const matchSearch = e.title.toLowerCase().includes(searchTerm.toLowerCase()) || e.serialTitle.toLowerCase().includes(searchTerm.toLowerCase());
    const matchSerial = selectedSerial==='all'||e.serialId===selectedSerial;
    return matchSearch && matchSerial;
  });

  const handleAdd = ()=>{ setEditingEpisode(null); setModalMode('add'); setShowModal(true); };
  const handleEdit = (ep)=>{ setEditingEpisode(ep); setModalMode('edit'); setShowModal(true); };
  const handleDelete = async (serialId, epId)=>{
    if(!window.confirm('Delete this episode?')) return;
    try{
      const token = localStorage.getItem('jwtToken');
      await axios.delete(`https://illegal-backend.vercel.app/api/serials/episodes/${epId}`, { headers:{Authorization:`Bearer ${token}`}});
      onDeleteEpisode(serialId, epId);
      toast.success('Deleted successfully');
    }catch(err){toast.error(err.response?.data?.msg||'Failed to delete');}
  };
  const handleSave = (ep)=> modalMode==='add'?onAddEpisode(ep):onEditEpisode(ep);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">Manage Episodes</h2>
        <button onClick={handleAdd} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded font-medium flex items-center">
          <Plus className="w-4 h-4 mr-2"/> Add Episode
        </button>
      </div>

      <div className="flex gap-4 mb-6">
        <input type="text" placeholder="Search..." value={searchTerm} onChange={e=>setSearchTerm(e.target.value)}
          className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"/>
        <select value={selectedSerial} onChange={e=>setSelectedSerial(e.target.value)}
          className="bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400">
          <option value="all">All Serials</option>
          {serials.map(s=> <option key={s._id} value={s._id}>{s.name}</option>)}
        </select>
      </div>

      <div className="grid gap-4">
        {filtered.length===0? <p className="text-gray-400">No episodes found.</p> : filtered.map(ep=>(
          <div key={ep._id} className="bg-gray-800 border border-gray-700 rounded-lg p-4 flex justify-between items-start">
            <div>
              <h3 className="text-lg font-semibold text-white">{ep.title}</h3>
              <p className="text-cyan-400">{ep.serialTitle}</p>
              <div className="flex space-x-2 text-sm text-gray-400">
                <span>Ep {ep.episodeNo}</span>
                <span>{ep.duration||'N/A'}</span>
                <span>{ep.date||'N/A'}</span>
              </div>
            </div>
            <div className="flex space-x-2">
              <button onClick={()=>handleEdit(ep)} className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded"><Edit className="w-4 h-4"/></button>
              <button onClick={()=>handleDelete(ep.serialId, ep._id)} className="bg-red-600 hover:bg-red-700 text-white p-2 rounded"><Trash2 className="w-4 h-4"/></button>
            </div>
          </div>
        ))}
      </div>

      <EpisodeFormModal isOpen={showModal} onClose={()=>setShowModal(false)} episode={editingEpisode} serials={serials} onSave={handleSave} mode={modalMode}/>
    </div>
  );
};

// ----------------- Main Admin Panel -----------------
const VoidCityAdminPanel = () => {
  const [activeTab, setActiveTab] = useState('serials');
  const [serials, setSerials] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(()=>{
    const fetchData = async ()=>{
      try{
        const token = localStorage.getItem('jwtToken');
        if(!token) throw new Error('No token found');

        const serialRes = await axios.get('https://illegal-backend.vercel.app/api/serials',{headers:{Authorization:`Bearer ${token}`}});
        const serialData = serialRes.data.data;
        const serialsWithEpisodes = await Promise.all(serialData.map(async s=>{
          try{
            const epRes = await axios.get(`https://illegal-backend.vercel.app/api/serials/${s._id}/episodes`,{headers:{Authorization:`Bearer ${token}`}});
            return {...s, episodes:epRes.data.data};
          }catch{return {...s, episodes:[]};}
        }));
        setSerials(serialsWithEpisodes);
      }catch(err){
        toast.error('Failed to fetch serials');
        if(err.response?.status===401){ localStorage.removeItem('jwtToken'); navigate('/login'); }
      }finally{ setIsLoading(false); }
    };
    fetchData();
  },[navigate]);

  const handleAddSerial = (s)=> setSerials(prev=>[...prev,s]);
  const handleEditSerial = (s)=> setSerials(prev=>prev.map(ps=>ps._id===s._id?s:ps));
  const handleDeleteSerial = (id)=> setSerials(prev=>prev.filter(ps=>ps._id!==id));

  const handleAddEpisode = (e)=> setSerials(prev=>prev.map(s=>s._id===e.serialId?{...s, episodes:[...(s.episodes||[]),e]}:s));
  const handleEditEpisode = (e)=> setSerials(prev=>prev.map(s=>s._id===e.serialId?{...s, episodes:s.episodes.map(ep=>ep._id===e._id?e:ep)}:s));
  const handleDeleteEpisode = (serialId, epId)=> setSerials(prev=>prev.map(s=>s._id===serialId?{...s, episodes:s.episodes.filter(ep=>ep._id!==epId)}:s));

  const handleLogout = ()=>{ localStorage.removeItem('jwtToken'); navigate('/login'); };

  if(isLoading) return <p className="text-white p-6">Loading...</p>;

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <ToastContainer/>
      <TopHeader onLogout={handleLogout}/>
      <NavigationTabs activeTab={activeTab} setActiveTab={setActiveTab}/>
      {activeTab==='serials'?
        <SerialsManagement serials={serials} onAddSerial={handleAddSerial} onEditSerial={handleEditSerial} onDeleteSerial={handleDeleteSerial}/> :
        <EpisodesManagement serials={serials} onAddEpisode={handleAddEpisode} onEditEpisode={handleEditEpisode} onDeleteEpisode={handleDeleteEpisode}/>
      }
    </div>
  );
};

export default VoidCityAdminPanel;
