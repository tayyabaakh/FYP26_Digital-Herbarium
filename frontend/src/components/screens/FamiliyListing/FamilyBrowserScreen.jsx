// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { botanicalFamilies } from '../../../utils/botanicalLoader';

// const FamilyBrowserScreen = () => {
//   const navigate = useNavigate();
//   const [searchQuery, setSearchQuery] = useState('');
//   const [selectedLetter, setSelectedLetter] = useState('All');
//   const [currentPage, setCurrentPage] = useState(1);
//   const itemsPerPage = 30;

//   const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

//   // 1. Sort all botanical families alphabetically by family name first
//   const sortedFamilies = [...botanicalFamilies].sort((a, b) => 
//     a.family.localeCompare(b.family, undefined, { sensitivity: 'base' })
//   );

//   // Determine active letters available in dataset
//   const activeLetters = new Set(sortedFamilies.map(f => f.family[0]));

//   const filteredFamilies = sortedFamilies.filter(fam => {
//     const matchesSearch = fam.family.toLowerCase().includes(searchQuery.toLowerCase());
//     const matchesLetter = selectedLetter === 'All' || fam.family.startsWith(selectedLetter);
//     return matchesSearch && matchesLetter;
//   });

//   const totalPages = Math.ceil(filteredFamilies.length / itemsPerPage);
//   const paginatedFamilies = filteredFamilies.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

//   return (
//     <div className="min-h-screen bg-[#FDFBF7] text-[#1B3022] p-6 lg:p-12 mt-10 font-display">
//       <div className="max-w-7xl mx-auto">
//         <p className="text-xs uppercase tracking-widest text-emerald-700 font-bold mb-2">Plant Families</p>
//         <h1 className="text-4xl font-serif font-bold mb-4">Browse All Families</h1>
//         <p className="text-gray-600 mb-8">218 plant families, listed alphabetically. Use the search field or A–Z filter to navigate.</p>

//         {/* Search & Alphabet Filter */}
//         <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm mb-10">
//           <input
//             type="text"
//             placeholder="Search family names..."
//             value={searchQuery}
//             onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
//             className="w-full py-3 px-5 rounded-xl border border-gray-200 mb-6 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
//           />

//           <div className="flex flex-wrap gap-1.5 items-center">
//             <button
//               onClick={() => { setSelectedLetter('All'); setCurrentPage(1); }}
//               className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase ${selectedLetter === 'All' ? 'bg-[#1B3022] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
//             >
//               All
//             </button>
//             {alphabet.map(letter => {
//               const isActive = activeLetters.has(letter);
//               return (
//                 <button
//                   key={letter}
//                   disabled={!isActive}
//                   onClick={() => { setSelectedLetter(letter); setCurrentPage(1); }}
//                   className={`w-9 h-9 rounded-lg text-xs font-bold transition-all ${
//                     selectedLetter === letter 
//                       ? 'bg-emerald-700 text-white shadow' 
//                       : isActive 
//                         ? 'bg-gray-100 text-gray-900 hover:bg-gray-200' 
//                         : 'bg-gray-50 text-gray-400 cursor-not-allowed opacity-50'
//                   }`}
//                 >
//                   {letter}
//                 </button>
//               );
//             })}
//           </div>
//         </div>

//         {/* Grid View */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
//           {paginatedFamilies.map(fam => (
//             <div
//               key={fam.id}
//               onClick={() => {
//                 navigate(`/family-listing/${encodeURIComponent(fam.family)}`);
//               }}
//               className="bg-white p-5 rounded-xl border border-gray-200 hover:border-emerald-600 shadow-sm transition-all cursor-pointer flex justify-between items-center group"
//             >
//               <div>
//                 <h4 className="font-bold text-[#1B3022] group-hover:text-emerald-700 text-sm tracking-wide">{fam.family}</h4>
//                 <p className="text-xs text-gray-400 mt-1">{fam.generaCount || fam.genera.length} genera, {fam.speciesCount ? `${fam.speciesCount} species` : '—'}</p>
//               </div>
//               <span className="material-icons-outlined text-gray-300 group-hover:text-emerald-600 text-sm">chevron_right</span>
//             </div>
//           ))}
//         </div>

//         {/* Pagination controls with ellipsis */}
//         {totalPages > 1 && (
//           <div className="flex justify-center items-center gap-2">
//             <button 
//               disabled={currentPage === 1}
//               onClick={() => setCurrentPage(p => p - 1)}
//               className="px-4 py-2 rounded-lg border border-gray-300 text-xs font-bold disabled:opacity-50"
//             >
//               Previous
//             </button>
//             <span className="text-sm font-medium text-gray-600">Page {currentPage} of {totalPages}</span>
//             <button 
//               disabled={currentPage === totalPages}
//               onClick={() => setCurrentPage(p => p + 1)}
//               className="px-4 py-2 rounded-lg border border-gray-300 text-xs font-bold disabled:opacity-50"
//             >
//               Next
//             </button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default FamilyBrowserScreen;



import React, { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { botanicalFamilies } from "../../../utils/botanicalLoader";
import { fetchPlants } from "../../../api/plantApi";

const PAGE_SIZE = 30;
const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
const FILTER_FIELDS = [
  { name: "family", label: "Family" },
  // { name: "genus", label: "Genus" },
  { name: "name", label: "Genus" },
  { name: "species", label: "Species" },
    { name: "collector_name", label: "Collector Name" },
  { name: "date", label: "Collection Date" },
  { name: "habit", label: "Habit" },
  { name: "locality", label: "Locality" },
  { name: "specimen_id_gh_number", label: "GH Number" },
];
const EMPTY_FILTERS = Object.fromEntries(FILTER_FIELDS.map(({ name }) => [name, ""]));
const SPECIMEN_FIELDS = ["name", "collector_name", "date", "habit", "locality", "specimen_id_gh_number"];
const norm = (value) => String(value ?? "").trim().toLocaleLowerCase();
const contains = (value, query) => norm(value).includes(norm(query));
const exact = (a, b) => norm(a) === norm(b);
const displaySpecies = (item) => String(item?.species ?? item?.name ?? "");

function buildCatalog(families) {
  const familyRows = [];
  const genusRows = [];
  const speciesRows = [];
  const specimenRows = [];

  for (const family of families ?? []) {
    const familyName = String(family.family ?? "");
    familyRows.push({ ...family, family: familyName, kind: "family" });

    for (const genus of family.genera ?? []) {
      const genusName = String(genus.genus ?? genus.name ?? "");
      const genusRow = {
        ...genus, family: familyName, genus: genusName,
        speciesCount: genus.speciesCount ?? genus.species?.length ?? 0,
        kind: "genus",
      };
      genusRows.push(genusRow);

      for (const entry of genus.species ?? []) {
        const species = typeof entry === "string" ? { name: entry } : entry ?? {};
        speciesRows.push({
          ...species, family: familyName, genus: genusName,
          species: displaySpecies(species), kind: "species",
        });
      }

      // Supports specimen arrays nested within a genus.
      for (const specimen of genus.specimens ?? []) {
        specimenRows.push({
          ...specimen, family: specimen.family ?? familyName,
          genus: specimen.genus ?? genusName, kind: "specimen",
        });
      }
    }

    // Supports specimen arrays nested directly within a family.
    for (const specimen of family.specimens ?? []) {
      specimenRows.push({
        ...specimen, family: specimen.family ?? familyName,
        kind: "specimen",
      });
    }
  }

  return { familyRows, genusRows, speciesRows, specimenRows };
}

const recordTitle = (record) => {
  switch (record.kind) {
    case "family": return record.family;
    case "genus": return record.genus;
    case "species": return record.species;
    default: return record.name || record.species || `GH ${record.specimen_id_gh_number ?? "Unknown"}`;
  }
};

// Stable URL identifier for a result, including duplicate species across families.
const recordKey = (record) => [
  record.kind, record.family, record.genus,
  record.species, record.specimen_id_gh_number,
  record.collection_no, record.name,
].map((value) => encodeURIComponent(String(value ?? ""))).join("~");

// Resolve a specimen's species to the full taxonomic name expected by SpeciesDetailScreen.
function resolveSpeciesName(specimen, speciesRows) {
  const raw = String(specimen.species ?? specimen.name ?? "").trim();
  if (!raw) return "";
  const familySpecies = speciesRows.filter((s) => exact(s.family, specimen.family));
  const matched = familySpecies.find((s) =>
    exact(s.species, raw) ||
    (specimen.genus && exact(s.species, `${specimen.genus} ${raw}`)) ||
    (specimen.name && exact(s.species, specimen.name)) ||
    (specimen.name && exact(s.species, `${specimen.name} ${specimen.species ?? ""}`)) ||
    exact(s.species.split(" ").slice(1).join(" "), specimen.species)
  );
  return matched?.species ?? "";
}

const FamilyBrowserScreen = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [search, setSearch] = useState("");
  const [letter, setLetter] = useState("All");
  const [page, setPage] = useState(1);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [highlightKey, setHighlightKey] = useState(null);
  const [dbSpecimens, setDbSpecimens] = useState([]);
  const [loadingSpecimens, setLoadingSpecimens] = useState(false);
  const [specimenError, setSpecimenError] = useState("");
  const cardRefs = useRef(new Map());
  const highlightTimer = useRef(null);

  const catalog = useMemo(() => buildCatalog(botanicalFamilies), []);

  // Fetch the actual specimen records from the same API used by SpeciesDetailScreen.
  // If your API paginates, replace fetchPlants() with an endpoint returning all
  // matching records (or implement server-side filtering and pagination).
  useEffect(() => {
    let active = true;
    const load = async () => {
      setLoadingSpecimens(true);
      setSpecimenError("");
      try {
        const response = await fetchPlants();
        const rows = Array.isArray(response) ? response
          : Array.isArray(response?.data) ? response.data
          : Array.isArray(response?.data?.plants) ? response.data.plants
          : Array.isArray(response?.plants) ? response.plants : [];
        if (active) setDbSpecimens(rows);
      } catch (error) {
        console.error("Unable to fetch specimen records", error);
        if (active) setSpecimenError("Could not load specimen records from the database.");
      } finally {
        if (active) setLoadingSpecimens(false);
      }
    };
    load();
    return () => { active = false; };
  }, []);

  const specimenRows = useMemo(() => {
    const fromDatabase = dbSpecimens.map((plant) => {
      const rawName = String(plant.name ?? "").trim();
      const rawSpecies = String(plant.species ?? "").trim();
      const family = String(plant.family ?? "").trim();
      const candidates = catalog.speciesRows.filter((row) => exact(row.family, family));
      const taxon = candidates.find((row) =>
        exact(row.species, rawSpecies) ||
        exact(row.species, rawName) ||
        exact(row.species, `${rawName} ${rawSpecies}`) ||
        (rawSpecies && exact(row.species.split(" ").slice(1).join(" "), rawSpecies))
      );
      return {
        ...plant,
        family,
        genus: plant.genus ?? taxon?.genus ?? rawName.split(/\s+/)[0] ?? "",
        species: taxon?.species ?? rawSpecies,
        kind: "specimen",
      };
    });
    return fromDatabase.length ? fromDatabase : catalog.specimenRows;
  }, [dbSpecimens, catalog]);
  const params = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const urlGenus = params.get("genus")?.trim() ?? "";
  const urlSpecies = params.get("species")?.trim() ?? "";
  const urlGH = params.get("gh")?.trim() ?? "";


  // URL links can preselect genus/species/GH even when opened in a new tab.
  useEffect(() => {
    if (!urlGenus && !urlSpecies && !urlGH) return;
    setFilters((prev) => ({
      ...EMPTY_FILTERS,
      genus: urlGenus,
      species: urlSpecies,
      specimen_id_gh_number: urlGH,
    }));
    setSearch("");
    setLetter("All");
    setPage(1);
  }, [urlGenus, urlSpecies, urlGH]);

  const resultType = useMemo(() => {
    if (SPECIMEN_FIELDS.some((field) => norm(filters[field]))) return "specimen";
    if (norm(filters.species)) return "species";
    if (norm(filters.genus)) return "genus";
    return "family";
  }, [filters]);

  const sourceRows = resultType === "family" ? catalog.familyRows
    : resultType === "genus" ? catalog.genusRows
    : resultType === "species" ? catalog.speciesRows
    : specimenRows;

  const filtered = useMemo(() => {
    return sourceRows.filter((row) => {
      // All active fields must match the SAME record.
      const matchFilters = FILTER_FIELDS.every(({ name }) => {
        if (!norm(filters[name])) return true;
        if (name === "species") return contains(row.species ?? row.name, filters[name]);
        if (name === "genus") return contains(row.genus, filters[name]);
        return contains(row[name], filters[name]);
      });
      if (!matchFilters) return false;
      const title = recordTitle(row);
      if (!contains(title, search)) return false;
      if (letter !== "All" && !norm(title).startsWith(norm(letter))) return false;
      return true;
    }).sort((a, b) => String(recordTitle(a)).localeCompare(String(recordTitle(b)), undefined, { sensitivity: "base" }));
  }, [sourceRows, filters, search, letter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const visible = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);
  const availableLetters = useMemo(() => new Set(sourceRows.map((r) => norm(recordTitle(r)).charAt(0).toUpperCase())), [sourceRows]);


  // Find a genus in the results, including a result on another pagination page.
  useEffect(() => {
    if (!urlGenus || resultType !== "genus") return;
    const index = filtered.findIndex((row) => exact(row.genus, urlGenus));
    if (index >= 0) setPage(Math.floor(index / PAGE_SIZE) + 1);
  }, [urlGenus, resultType, filtered]);

  useEffect(() => {
    if (!urlGenus || resultType !== "genus") return;
    const row = visible.find((item) => exact(item.genus, urlGenus));
    if (!row) return;
    const key = recordKey(row);
    const timer = window.setTimeout(() => {
      const element = cardRefs.current.get(key);
      if (!element) return;
      element.scrollIntoView({ behavior: "smooth", block: "center" });
      setHighlightKey(key);
      window.clearTimeout(highlightTimer.current);
      highlightTimer.current = window.setTimeout(() => setHighlightKey(null), 3000);
    }, 120);
    return () => window.clearTimeout(timer);
  }, [urlGenus, resultType, safePage, visible]);

  useEffect(() => () => window.clearTimeout(highlightTimer.current), []);

  const updateFilter = (name, value) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
    setPage(1);
    setLetter("All");
    // Remove old deep-link filters when manually searching.
    if (location.search) navigate(location.pathname, { replace: true });
  };

  const reset = () => {
    setFilters({ ...EMPTY_FILTERS });
    setSearch("");
    setLetter("All");
    setPage(1);
    setHighlightKey(null);
    if (location.search) navigate(location.pathname, { replace: true });
  };

  const openRecord = (record) => {
    if (!record.family) {
      console.warn("Cannot open a record without a family", record);
      return;
    }
    const familyPath = `/family-listing/${encodeURIComponent(record.family)}`;
    if (record.kind === "family") {
      navigate(familyPath);
      return;
    }
    if (record.kind === "genus") {
      navigate(`${familyPath}?genus=${encodeURIComponent(record.genus)}`);
      return;
    }
    // Species detail is an existing route in your application.
    // For specimens, pass GH to preselect the exact specimen on that page.
    const speciesName = record.kind === "species"
      ? record.species
      : resolveSpeciesName(record, catalog.speciesRows);
    if (!speciesName) {
      console.warn("No matching taxonomic species route exists for this specimen", record);
      return;
    }
    const speciesPath = `${familyPath}/species/${encodeURIComponent(speciesName)}`;
    const gh = record.kind === "specimen" ? record.specimen_id_gh_number : null;
    navigate(gh != null && String(gh).trim() !== ""
      ? `${speciesPath}?gh=${encodeURIComponent(String(gh))}`
      : speciesPath, { state: record.kind === "specimen" ? { selectedSpecimen: record } : null });
  };

  const activeCount = Object.values(filters).filter((v) => norm(v)).length;

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#1B3022] p-6 lg:p-12 mt-10 font-display">
      {drawerOpen && <div className="fixed inset-0 bg-black/40 z-[100]" onClick={() => setDrawerOpen(false)} />}
      <aside className={`fixed top-0 right-0 h-full w-full sm:w-96 bg-white z-[110] shadow-2xl flex flex-col transition-transform duration-300 ${drawerOpen ? "translate-x-0" : "translate-x-full"}`}>
        <div className="p-6 border-b flex items-center justify-between">
          <div><p className="text-xs uppercase tracking-widest text-emerald-700 font-bold">Refine your search</p><h2 className="text-xl font-bold">Advanced Filters</h2></div>
          <button type="button" onClick={() => setDrawerOpen(false)} aria-label="Close filters" className="p-2 rounded-lg bg-gray-100">✕</button>
        </div>
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          {FILTER_FIELDS.map(({ name, label }) => (
            <label key={name} className="block">
              <span className="text-xs font-bold uppercase text-gray-700">{label}</span>
              <input type="text" value={filters[name]} onChange={(e) => updateFilter(name, e.target.value)}
                placeholder={`Search ${label.toLowerCase()}...`}
                className="w-full mt-2 border border-gray-300 rounded-lg p-3 text-sm outline-none focus:ring-2 focus:ring-emerald-600" />
            </label>
          ))}
        </div>
        <div className="p-6 border-t space-y-3">
          <button type="button" onClick={reset} className="w-full py-3 border border-red-200 text-red-600 rounded-xl text-xs font-bold">Reset All Filters</button>
          <button type="button" onClick={() => setDrawerOpen(false)} className="w-full py-3 bg-[#1B3022] text-white rounded-xl font-bold">Show {filtered.length} Results</button>
        </div>
      </aside>

      <main className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-8">
          <div><p className="text-xs uppercase tracking-widest text-emerald-700 font-bold mb-2">Botanical Database</p>
            <h1 className="text-4xl font-serif font-bold">Browse Botanical Records</h1>
            <p className="text-gray-600 mt-3">Search families, genera, species, and specimen records.</p>
          </div>
          <button type="button" onClick={() => setDrawerOpen(true)} className="bg-[#1B3022] text-white px-5 py-3 rounded-xl font-bold text-sm">☰ Filters {activeCount > 0 && <span className="ml-2 bg-emerald-600 rounded-full px-2 py-1">{activeCount}</span>}</button>
        </div>

        <section className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm mb-8">
          <input value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder={`Search ${resultType === "genus" ? "genera" : `${resultType}s`}...`}
            className="w-full py-3 px-5 rounded-xl border border-gray-200 mb-6 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600" />
          <div className="flex flex-wrap gap-1.5 items-center">
            <button type="button" onClick={() => { setLetter("All"); setPage(1); }} className={`px-3 py-1.5 rounded-lg text-xs font-bold ${letter === "All" ? "bg-[#1B3022] text-white" : "bg-gray-100"}`}>All</button>
            {ALPHABET.map((l) => <button key={l} type="button" disabled={!availableLetters.has(l)} onClick={() => { setLetter(l); setPage(1); }}
              className={`w-9 h-9 rounded-lg text-xs font-bold ${letter === l ? "bg-emerald-700 text-white" : availableLetters.has(l) ? "bg-gray-100 hover:bg-gray-200" : "bg-gray-50 text-gray-400 opacity-50"}`}>{l}</button>)}
          </div>
        </section>

        <div className="flex justify-between items-center gap-3 mb-6">
          <div><h2 className="text-xl font-bold capitalize">{resultType === "genus" ? "Genera" : `${resultType}s`} Results</h2><p className="text-sm text-gray-500">Showing {filtered.length} results</p></div>
          {(activeCount > 0 || search || letter !== "All") && <button type="button" onClick={reset} className="text-xs font-bold text-red-600 underline">Clear All Filters</button>}
        </div>

        {visible.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            {visible.map((record) => {
              const key = recordKey(record);
              return <button key={key} type="button" ref={(node) => { if (node) cardRefs.current.set(key, node); else cardRefs.current.delete(key); }}
                onClick={() => openRecord(record)}
                className={`text-left bg-white p-5 rounded-xl border border-gray-200 hover:border-emerald-600 shadow-sm hover:shadow-md transition-all scroll-mt-24 ${highlightKey === key ? "ring-4 ring-emerald-500 ring-offset-4 bg-emerald-50 shadow-lg" : ""}`}>
                <div className="flex justify-between gap-3">
                  <div className="min-w-0"><h3 className="font-bold text-[#1B3022] text-sm break-words">{recordTitle(record)}</h3>
                 {/* Family */}
{record.kind !== "family" && (
  <p className="text-xs text-gray-500 mt-2">
    Family: {record.family}
  </p>
)}

{/* Genus */}
{(record.kind === "species" || record.kind === "specimen") &&
  record.genus && (
    <p className="text-xs text-gray-500 mt-1">
      Genus: {record.genus}
    </p>
  )}

{/* Family Statistics */}
{record.kind === "family" && (
  <p className="text-xs text-gray-500 mt-2">
    {record.generaCount ?? record.genera?.length ?? 0} genera ·{" "}
    {record.speciesCount ?? "—"} species
  </p>
)}

{/* Genus Statistics */}
{record.kind === "genus" && (
  <p className="text-xs text-gray-500 mt-1">
    {record.speciesCount} species
  </p>
)}

{/* Specimen Details */}
{record.kind === "specimen" && (
  <div className="mt-2 space-y-1">

    {record.species && (
      <p className="text-xs text-gray-500">
        <strong>Species:</strong> {record.species}
      </p>
    )}

    {record.collector_name && (
      <p className="text-xs text-gray-500">
        <strong>Collector:</strong> {record.collector_name}
      </p>
    )}

    {record.date && (
      <p className="text-xs text-gray-500">
        <strong>Collection Date:</strong> {record.date}
      </p>
    )}

    {record.habit && (
      <p className="text-xs text-gray-500">
        <strong>Habit:</strong> {record.habit}
      </p>
    )}

    {record.locality && (
      <p className="text-xs text-gray-500">
        <strong>Locality:</strong> {record.locality}
      </p>
    )}

    {record.specimen_id_gh_number != null && (
      <p className="text-xs text-gray-500">
        <strong>GH Number:</strong> {record.specimen_id_gh_number}
      </p>
    )}

  </div>
)}
                  </div><span className="text-emerald-700">›</span>
                </div>
              </button>;
            })}
          </div>
        ) : <div className="bg-white border rounded-2xl p-12 text-center mb-10"><div className="text-4xl mb-3">🌿</div><h3 className="font-bold text-xl">No Results Found</h3><p className="text-sm text-gray-500 mt-2">Try changing your filters. Specimen searches require specimen data in botanicalFamilies.</p><button onClick={reset} className="mt-5 px-6 py-3 rounded-xl bg-[#1B3022] text-white">Reset Filters</button></div>}

        {totalPages > 1 && <div className="flex justify-center items-center gap-3">
          <button disabled={safePage === 1} onClick={() => setPage((p) => Math.max(1, p - 1))} className="px-4 py-2 rounded-lg border disabled:opacity-40">Previous</button>
          <span className="text-sm">Page {safePage} of {totalPages}</span>
          <button disabled={safePage === totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))} className="px-4 py-2 rounded-lg border disabled:opacity-40">Next</button>
        </div>}
      </main>

      {/* Deep-linkable detail view. Replace this panel with your existing plant detail route if desired. */}

    </div>
  );
};

export default FamilyBrowserScreen;
