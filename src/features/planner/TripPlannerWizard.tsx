import React, { useState, useEffect, useMemo } from 'react';
import {
  TripPreferences,
  TransportDetails,
  TravellerDetails,
  AccommodationPreferences,
  FoodPreference,
  TravelPace,
  InterestCategory,
  GroupType,
  MobilityRequirement,
  HotelCategory,
  RoomQuality,
} from '../../types/travel';
import { DESTINATIONS } from '../../data/destinations';
import { getDestinationBundle, isDestinationSupported } from '../../data/registry';
import { validateTripDates, addDays, formatDisplayDate } from '../../lib/validation/dateValidation';
import {
  Compass,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Calendar,
  Plane,
  Train,
  Car,
  Users,
  Building,
  Utensils,
  Sparkles,
  AlertCircle,
  Clock,
  Heart,
  ChevronRight,
  Info,
} from 'lucide-react';

interface TripPlannerWizardProps {
  initialDestinationId?: string;
  onGenerateItinerary: (preferences: TripPreferences) => void;
  onCancel: () => void;
}

export const TripPlannerWizard: React.FC<TripPlannerWizardProps> = ({
  initialDestinationId = '',
  onGenerateItinerary,
  onCancel,
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 7;

  // Default dates helper
  const getDefaultDates = () => {
    const dep = new Date();
    dep.setDate(dep.getDate() + 14); // 2 weeks ahead
    const ret = new Date(dep);
    ret.setDate(ret.getDate() + 4); // 5 days total

    return {
      dep: dep.toISOString().split('T')[0],
      ret: ret.toISOString().split('T')[0],
    };
  };

  const defaultDates = getDefaultDates();

  // Wizard state
  const [destinationId, setDestinationId] = useState<string>(initialDestinationId);
  const [departureDate, setDepartureDate] = useState<string>(defaultDates.dep);
  const [returnDate, setReturnDate] = useState<string>(defaultDates.ret);

  // Active destination bundle
  const activeBundle = getDestinationBundle(destinationId);
  const isSupported = isDestinationSupported(destinationId);

  // Transport
  const [onwardTransport, setOnwardTransport] = useState<TransportDetails>({
    mode: 'air',
    departureLocation: 'New Delhi (DEL)',
    arrivalLocation: activeBundle?.defaultArrivalAirport || 'Arrival Airport',
    isBooked: false,
    roadVehicleType: 'private-cab',
  });

  const [returnTransport, setReturnTransport] = useState<TransportDetails>({
    mode: 'air',
    departureLocation: activeBundle?.defaultArrivalAirport || 'Departure Airport',
    arrivalLocation: 'New Delhi (DEL)',
    isBooked: false,
    roadVehicleType: 'private-cab',
  });

  // Travellers
  const [travellers, setTravellers] = useState<TravellerDetails>({
    adults: 2,
    children: 0,
    rooms: 1,
    groupType: 'couple',
    mobilityRequirements: 'standard',
  });

  // Accommodation
  const [accommodation, setAccommodation] = useState<AccommodationPreferences>({
    category: '4-star',
    roomQuality: 'deluxe',
    roomsCount: 1,
    maxNightlyBudget: 12000,
    preferredArea: activeBundle?.defaultPreferredArea || 'Central Area',
  });

  // Preferences & Budget
  const [budgetType, setBudgetType] = useState<'total' | 'per-person'>('total');
  const [targetBudget, setTargetBudget] = useState<number>(75000);
  const [travelPace, setTravelPace] = useState<TravelPace>('balanced');
  const [foodPreference, setFoodPreference] = useState<FoodPreference>('pure-veg');
  const [selectedInterests, setSelectedInterests] = useState<InterestCategory[]>([
    'nature',
    'photography',
    'relaxation',
  ]);
  const [mustVisitAttractions, setMustVisitAttractions] = useState<string[]>(
    activeBundle?.attractions.slice(0, 3).map((a) => a.id) || []
  );
  const [avoidAttractions, setAvoidAttractions] = useState<string[]>([]);

  // When destination changes, update dependent fields cleanly without leaking previous destination data
  const handleSelectDestination = (newDestId: string) => {
    setDestinationId(newDestId);
    const bundle = getDestinationBundle(newDestId);
    if (bundle) {
      setOnwardTransport((prev) => ({
        ...prev,
        arrivalLocation: bundle.defaultArrivalAirport,
      }));
      setReturnTransport((prev) => ({
        ...prev,
        departureLocation: bundle.defaultArrivalAirport,
      }));
      setAccommodation((prev) => ({
        ...prev,
        preferredArea: bundle.defaultPreferredArea,
      }));
      setMustVisitAttractions(bundle.attractions.slice(0, 3).map((a) => a.id));
      setAvoidAttractions([]);
    } else {
      setMustVisitAttractions([]);
      setAvoidAttractions([]);
    }
  };


  // Real-time date validation using the validation engine
  const dateValidation = useMemo(
    () => validateTripDates(departureDate, returnDate, destinationId || 'kashmir'),
    [departureDate, returnDate, destinationId]
  );
  const durationDays = dateValidation.durationDays || 1;

  // Legacy compat
  const isDateInvalid = !!dateValidation.errors.returnDate;
  const isPastDate = dateValidation.warnings.some(w => w.includes('past'));

  // Interest toggle
  const toggleInterest = (cat: InterestCategory) => {
    if (selectedInterests.includes(cat)) {
      setSelectedInterests(selectedInterests.filter((c) => c !== cat));
    } else {
      setSelectedInterests([...selectedInterests, cat]);
    }
  };

  // Must-visit toggle
  const toggleMustVisit = (id: string) => {
    if (mustVisitAttractions.includes(id)) {
      setMustVisitAttractions(mustVisitAttractions.filter((m) => m !== id));
    } else {
      setMustVisitAttractions([...mustVisitAttractions, id]);
    }
  };

  const handleNext = () => {
    if (currentStep === 1 && !isSupported) {
      return; // Prevent advancing with unsupported destination
    }
    if (currentStep === 2 && !dateValidation.isValid) {
      return; // Prevent advancing with invalid dates
    }
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      onCancel();
    }
  };

  const handleSubmit = () => {
    if (!isSupported) return;

    const preferences: TripPreferences = {
      destinationId,
      departureDate,
      returnDate,
      durationDays,
      onwardTransport,
      returnTransport,
      travellers,
      accommodation: {
        ...accommodation,
        roomsCount: travellers.rooms,
      },
      budgetType,
      targetBudget,
      travelPace,
      foodPreference,
      interests: selectedInterests,
      mustVisitAttractionIds: mustVisitAttractions,
      avoidAttractionIds: avoidAttractions,
    };

    onGenerateItinerary(preferences);
  };

  // Sample Trip Loader
  const handleLoadSampleTrip = () => {
    const now = new Date();
    let yr = now.getFullYear();
    if (new Date(yr, 4, 10) < now) yr += 1;
    const dep = `${yr}-05-12`;
    const ret = `${yr}-05-16`;

    handleSelectDestination('kashmir');
    setDepartureDate(dep);
    setReturnDate(ret);
    setOnwardTransport({
      mode: 'air',
      departureLocation: 'Ahmedabad (AMD)',
      arrivalLocation: 'Srinagar (SXR)',
      departureTimePreference: '07:30 AM',
      isBooked: false,
      roadVehicleType: 'private-cab',
    });
    setReturnTransport({
      mode: 'air',
      departureLocation: 'Srinagar (SXR)',
      arrivalLocation: 'Ahmedabad (AMD)',
      departureTimePreference: '03:30 PM',
      isBooked: false,
      roadVehicleType: 'private-cab',
    });
    setTravellers({
      adults: 2,
      children: 0,
      rooms: 1,
      groupType: 'couple',
      mobilityRequirements: 'standard',
    });
    setAccommodation({
      category: '4-star',
      roomQuality: 'deluxe',
      roomsCount: 1,
      maxNightlyBudget: 14000,
      preferredArea: 'Srinagar Dal Lake / Boulevard',
    });
    setBudgetType('total');
    setTargetBudget(90000);
    setTravelPace('balanced');
    setFoodPreference('pure-veg');
    setSelectedInterests(['nature', 'photography', 'relaxation', 'culture']);
    setMustVisitAttractions(['srinagar-dal-lake-shikara', 'gulmarg-gondola-phase-1', 'pahalgam-betaab-valley']);
    setAvoidAttractions([]);
    setCurrentStep(7);
  };

  const selectedDestination = DESTINATIONS.find((d) => d.id === destinationId) ?? null;
  const destinationLabel = selectedDestination?.name ?? 'your selected destination';

  const stepsList = [
    'Destination',
    'Travel Dates',
    'Transit',
    'Travellers',
    'Hotel Category',
    'Pace & Dining',
    'Review Blueprint',
  ];

  return (
    <div className="min-h-screen bg-ivory-100 py-10 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-4xl mx-auto">
        {/* Top Header & Breadcrumb Progress */}
        <div className="bg-white rounded-2xl border border-stone-250 shadow-soft p-6 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div className="flex items-center space-x-2">
              <Compass className="w-5 h-5 text-champagne-600" />
              <span className="font-serif text-lg font-bold text-ink-950">
                WAYFARER Planner
              </span>
            </div>
            <div className="flex items-center space-x-3">
              <button
                type="button"
                onClick={handleLoadSampleTrip}
                className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-champagne-300 bg-champagne-50 hover:bg-champagne-100 text-champagne-900 flex items-center space-x-1.5 transition-all"
                title="Load curated 5-day Kashmir itinerary sample"
              >
                <Sparkles className="w-3.5 h-3.5 text-champagne-600" />
                <span>Use Sample Trip</span>
              </button>
              <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
                Step {currentStep} of {totalSteps} — {stepsList[currentStep - 1]}
              </span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-stone-200 h-2 rounded-full overflow-hidden mb-6">
            <div
              className="bg-champagne-500 h-full transition-all duration-500 rounded-full"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            />
          </div>

          {/* Step Pill Links */}
          <div className="hidden sm:flex items-center justify-between text-[11px] font-semibold text-stone-500 overflow-x-auto">
            {stepsList.map((name, index) => {
              const stepNum = index + 1;
              const isPassed = stepNum < currentStep;
              const isCurrent = stepNum === currentStep;

              return (
                <button
                  key={name}
                  onClick={() => {
                    if (isSupported || stepNum === 1) setCurrentStep(stepNum);
                  }}
                  className={`flex items-center space-x-1.5 pb-1 transition-colors ${
                    isCurrent
                      ? 'text-ink-900 border-b-2 border-champagne-500 font-bold'
                      : isPassed
                      ? 'text-sage-700 hover:text-ink-900'
                      : 'text-stone-400 hover:text-stone-600'
                  }`}
                >
                  <span
                    className={`w-4 h-4 rounded-full text-[10px] flex items-center justify-center ${
                      isCurrent
                        ? 'bg-ink-900 text-ivory-50'
                        : isPassed
                        ? 'bg-sage-100 text-sage-800'
                        : 'bg-stone-200 text-stone-600'
                    }`}
                  >
                    {isPassed ? '✓' : stepNum}
                  </span>
                  <span>{name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Wizard Main Content Container */}
        <div className="bg-white rounded-2xl border border-stone-250 shadow-elevated p-6 sm:p-10 mb-8">
          {/* STEP 1: DESTINATION */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-champagne-600">
                  STEP 01
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-ink-950 mt-1">
                  Where would you like to travel?
                </h2>
                <p className="text-xs sm:text-sm text-stone-600 mt-1">
                  Select your destination. Each option can carry its own verified local dataset, seasonal logic, and itinerary recommendations.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                {DESTINATIONS.map((dest) => (
                  <div
                    key={dest.id}
                    onClick={() => handleSelectDestination(dest.id)}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex items-start space-x-4 ${
                      destinationId === dest.id
                        ? 'border-champagne-500 bg-champagne-50/50 shadow-soft ring-1 ring-champagne-400'
                        : 'border-stone-200 hover:border-stone-300 bg-white'
                    }`}
                  >
                    <img
                      src={dest.thumbnail}
                      alt={dest.name}
                      className="w-20 h-20 rounded-lg object-cover shrink-0"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="font-serif text-base font-bold text-ink-900 truncate">
                          {dest.name}
                        </h4>
                        {isDestinationSupported(dest.id) ? (
                          <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-sage-100 text-sage-800 shrink-0">
                            Fully Curated
                          </span>
                        ) : (
                          <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-stone-100 text-stone-500 shrink-0">
                            Preview
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-stone-500 mt-0.5">{dest.state}, {dest.country}</p>
                      <p className="text-[11px] text-stone-600 mt-1 line-clamp-2">
                        {dest.overview}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Unsupported / Preview Warning */}
              {!destinationId && (
                <div className="p-4 rounded-xl bg-sage-50 border border-sage-200 text-xs text-sage-900">
                  Choose a destination above to see its planning status and continue.
                </div>
              )}

              {destinationId && !isSupported && (
                <div className="p-5 rounded-xl bg-amber-50 border border-amber-300 text-xs text-amber-950 space-y-3">
                  <div className="flex items-start space-x-2.5">
                    <AlertCircle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                    <div>
                      <h5 className="font-bold text-amber-900 text-sm">
                        Curated Dataset in Development: {destinationLabel}
                      </h5>
                      <p className="text-xs text-amber-800 mt-1 leading-relaxed">
                        To maintain strict travel integrity and prevent fabricated attractions or hotel links, WAYFARER only generates itineraries for destinations with verified local datasets. Detailed itineraries for {destinationLabel} are currently in development.
                      </p>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-amber-200 flex flex-wrap items-center gap-3">
                    <span className="font-semibold text-amber-900">Choose a fully curated destination from the list above.</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STEP 2: TRAVEL DATES */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-champagne-600">
                  STEP 02
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-ink-950 mt-1">
                  When are you travelling to {destinationLabel}?
                </h2>
                <p className="text-xs sm:text-sm text-stone-600 mt-1">
                  We use your travel window to consider seasonal conditions and destination access.
                </p>
              </div>

              {/* Quick Duration Presets */}
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-stone-500 block mb-3">
                  Quick Duration Presets
                </span>
                <div className="flex flex-wrap gap-2">
                  {[
                    { label: 'Weekend Escape', days: 3, nights: 2 },
                    { label: 'Curated Classic', days: 5, nights: 4 },
                    { label: 'Regional Explorer', days: 7, nights: 6 },
                    { label: 'Grand Discovery', days: 10, nights: 9 },
                  ].map((preset) => {
                    const isActive = durationDays === preset.days;
                    return (
                      <button
                        key={preset.days}
                        type="button"
                        onClick={() => {
                          const newReturn = addDays(departureDate, preset.days - 1);
                          setReturnDate(newReturn);
                        }}
                        className={`px-4 py-2.5 rounded-xl text-xs font-semibold border transition-all ${
                          isActive
                            ? 'bg-ink-900 text-ivory-50 border-ink-900 shadow-soft'
                            : 'bg-white text-stone-700 border-stone-300 hover:border-champagne-400 hover:bg-champagne-50'
                        }`}
                      >
                        <span className="block font-bold">{preset.label}</span>
                        <span className="block text-[11px] opacity-70 mt-0.5">{preset.days} Days / {preset.nights} Nights</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Date Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-2">
                    Departure Date
                  </label>
                  <input
                    type="date"
                    value={departureDate}
                    onChange={(e) => {
                      const newDep = e.target.value;
                      setDepartureDate(newDep);
                      // Auto-sync return date if it would become before departure
                      if (newDep && returnDate && returnDate < newDep) {
                        setReturnDate(addDays(newDep, Math.max(1, durationDays - 1)));
                      }
                    }}
                    className={`w-full px-4 py-3 rounded-xl border text-ink-900 font-medium focus:ring-2 focus:ring-champagne-400 focus:outline-none transition-colors ${
                      dateValidation.errors.departureDate
                        ? 'border-red-400 bg-red-50'
                        : 'border-stone-300 bg-white'
                    }`}
                  />
                  {dateValidation.errors.departureDate && (
                    <p className="text-xs text-red-700 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {dateValidation.errors.departureDate}
                    </p>
                  )}
                  {departureDate && !dateValidation.errors.departureDate && (
                    <p className="text-xs text-stone-500 mt-1">{formatDisplayDate(departureDate)}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-2">
                    Return Date
                  </label>
                  <input
                    type="date"
                    value={returnDate}
                    min={departureDate}
                    onChange={(e) => setReturnDate(e.target.value)}
                    className={`w-full px-4 py-3 rounded-xl border text-ink-900 font-medium focus:ring-2 focus:ring-champagne-400 focus:outline-none transition-colors ${
                      dateValidation.errors.returnDate
                        ? 'border-red-400 bg-red-50'
                        : 'border-stone-300 bg-white'
                    }`}
                  />
                  {dateValidation.errors.returnDate && (
                    <p className="text-xs text-red-700 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {dateValidation.errors.returnDate}
                    </p>
                  )}
                  {returnDate && !dateValidation.errors.returnDate && (
                    <p className="text-xs text-stone-500 mt-1">{formatDisplayDate(returnDate)}</p>
                  )}
                </div>
              </div>

              {/* Real-time warnings */}
              {dateValidation.warnings.length > 0 && (
                <div className="space-y-2">
                  {dateValidation.warnings.map((warning, i) => (
                    <div key={i} className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      <span>{warning}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Duration Summary Badge */}
              {!dateValidation.errors.returnDate && durationDays > 0 && (
                <div className="p-5 rounded-xl bg-gradient-to-r from-champagne-50 to-stone-50 border border-champagne-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-champagne-100 border border-champagne-300 flex items-center justify-center shrink-0">
                      <Calendar className="w-5 h-5 text-champagne-700" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-ink-900">
                        {durationDays} Day{durationDays !== 1 ? 's' : ''} / {dateValidation.nightsCount} Night{dateValidation.nightsCount !== 1 ? 's' : ''}
                      </h4>
                      <p className="text-xs text-stone-500">
                        {dateValidation.formattedRange || `${departureDate} → ${returnDate}`}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-champagne-700 bg-champagne-100 px-3 py-1 rounded-full">
                      {durationDays <= 3 ? 'Weekend Getaway' : durationDays <= 5 ? 'Classic Journey' : durationDays <= 7 ? 'Regional Explorer' : 'Grand Discovery'}
                    </span>
                  </div>
                </div>
              )}

              {/* Seasonal Intelligence Card */}
              {dateValidation.seasonInfo && (
                <div className="p-5 rounded-xl border border-stone-200 bg-white shadow-soft">
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles className="w-4 h-4 text-champagne-600" />
                    <span className="text-xs font-bold uppercase tracking-wider text-stone-700">
                      Seasonal Intelligence — {dateValidation.seasonInfo.seasonName}
                    </span>
                  </div>
                  <p className="text-sm font-serif text-ink-900 mb-2 italic">{dateValidation.seasonInfo.tagline}</p>
                  <div className="flex flex-wrap gap-3 mt-3">
                    <span className="text-xs bg-stone-100 text-stone-700 px-3 py-1.5 rounded-lg font-medium flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      {dateValidation.seasonInfo.temperatureRange}
                    </span>
                    {dateValidation.seasonInfo.snowLikelihood && dateValidation.seasonInfo.snowLikelihood !== 'none' && (
                      <span className="text-xs bg-blue-50 text-blue-700 px-3 py-1.5 rounded-lg font-medium">
                        ❄ Snow: {dateValidation.seasonInfo.snowLikelihood}
                      </span>
                    )}
                  </div>
                  {dateValidation.seasonInfo.advisories.length > 0 && (
                    <ul className="mt-3 space-y-1">
                      {dateValidation.seasonInfo.advisories.map((adv, i) => (
                        <li key={i} className="text-xs text-stone-600 flex items-start gap-1.5">
                          <Info className="w-3.5 h-3.5 text-champagne-600 shrink-0 mt-0.5" />
                          {adv}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}

            </div>
          )}

          {/* STEP 3: TRANSPORTATION */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-champagne-600">
                  STEP 03
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-ink-950 mt-1">
                  Transit to and from {destinationLabel}
                </h2>
                <p className="text-xs sm:text-sm text-stone-600 mt-1">
                  Add your origin and transport preferences to inform route planning and budget estimates.
                </p>
              </div>

              {/* Onward Transport Section */}
              <div className="p-6 rounded-xl border border-stone-250 bg-stone-50/70 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif text-base font-bold text-ink-900">
                    Onward Journey to {destinationLabel}
                  </h3>
                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={() => setOnwardTransport({ ...onwardTransport, mode: 'air' })}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 ${
                        onwardTransport.mode === 'air'
                          ? 'bg-ink-900 text-ivory-50'
                          : 'bg-white border text-stone-700'
                      }`}
                    >
                      <Plane className="w-3.5 h-3.5" />
                      <span>By Air</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setOnwardTransport({ ...onwardTransport, mode: 'train' })}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 ${
                        onwardTransport.mode === 'train'
                          ? 'bg-ink-900 text-ivory-50'
                          : 'bg-white border text-stone-700'
                      }`}
                    >
                      <Train className="w-3.5 h-3.5" />
                      <span>By Train</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setOnwardTransport({ ...onwardTransport, mode: 'road' })}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 ${
                        onwardTransport.mode === 'road'
                          ? 'bg-ink-900 text-ivory-50'
                          : 'bg-white border text-stone-700'
                      }`}
                    >
                      <Car className="w-3.5 h-3.5" />
                      <span>By Road</span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-stone-600 mb-1">
                      {onwardTransport.mode === 'air'
                        ? 'Departure Airport'
                        : onwardTransport.mode === 'train'
                        ? 'Departure Railway Station'
                        : 'Origin City / Location'}
                    </label>
                    <input
                      type="text"
                      value={onwardTransport.departureLocation}
                      onChange={(e) =>
                        setOnwardTransport({ ...onwardTransport, departureLocation: e.target.value })
                      }
                      className="w-full px-3 py-2 text-sm rounded-lg border border-stone-300 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-stone-600 mb-1">
                      {onwardTransport.mode === 'air'
                        ? 'Arrival Airport'
                        : onwardTransport.mode === 'train'
                        ? 'Arrival Station'
                        : 'Arrival Point'}
                    </label>
                    <input
                      type="text"
                      value={onwardTransport.arrivalLocation}
                      onChange={(e) =>
                        setOnwardTransport({ ...onwardTransport, arrivalLocation: e.target.value })
                      }
                      className="w-full px-3 py-2 text-sm rounded-lg border border-stone-300 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-3 pt-1">
                  <input
                    type="checkbox"
                    id="onwardBooked"
                    checked={onwardTransport.isBooked}
                    onChange={(e) =>
                      setOnwardTransport({ ...onwardTransport, isBooked: e.target.checked })
                    }
                    className="w-4 h-4 text-champagne-600 rounded border-stone-300 focus:ring-champagne-500"
                  />
                  <label htmlFor="onwardBooked" className="text-xs text-stone-700">
                    Onward transit already booked? (Uncheck to include estimated airfare in budget calculator)
                  </label>
                </div>
              </div>

              {/* Return Transport Section */}
              <div className="p-6 rounded-xl border border-stone-250 bg-stone-50/70 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif text-base font-bold text-ink-900">
                    Return Journey
                  </h3>
                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={() => setReturnTransport({ ...returnTransport, mode: 'air' })}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 ${
                        returnTransport.mode === 'air'
                          ? 'bg-ink-900 text-ivory-50'
                          : 'bg-white border text-stone-700'
                      }`}
                    >
                      <Plane className="w-3.5 h-3.5" />
                      <span>By Air</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setReturnTransport({ ...returnTransport, mode: 'train' })}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 ${
                        returnTransport.mode === 'train'
                          ? 'bg-ink-900 text-ivory-50'
                          : 'bg-white border text-stone-700'
                      }`}
                    >
                      <Train className="w-3.5 h-3.5" />
                      <span>By Train</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setReturnTransport({ ...returnTransport, mode: 'road' })}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 ${
                        returnTransport.mode === 'road'
                          ? 'bg-ink-900 text-ivory-50'
                          : 'bg-white border text-stone-700'
                      }`}
                    >
                      <Car className="w-3.5 h-3.5" />
                      <span>By Road</span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-stone-600 mb-1">
                      Departure Point
                    </label>
                    <input
                      type="text"
                      value={returnTransport.departureLocation}
                      onChange={(e) =>
                        setReturnTransport({ ...returnTransport, departureLocation: e.target.value })
                      }
                      className="w-full px-3 py-2 text-sm rounded-lg border border-stone-300 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-stone-600 mb-1">
                      Return Destination
                    </label>
                    <input
                      type="text"
                      value={returnTransport.arrivalLocation}
                      onChange={(e) =>
                        setReturnTransport({ ...returnTransport, arrivalLocation: e.target.value })
                      }
                      className="w-full px-3 py-2 text-sm rounded-lg border border-stone-300 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-3 pt-1">
                  <input
                    type="checkbox"
                    id="returnBooked"
                    checked={returnTransport.isBooked}
                    onChange={(e) =>
                      setReturnTransport({ ...returnTransport, isBooked: e.target.checked })
                    }
                    className="w-4 h-4 text-champagne-600 rounded border-stone-300 focus:ring-champagne-500"
                  />
                  <label htmlFor="returnBooked" className="text-xs text-stone-700">
                    Return transit already booked?
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: TRAVELLERS */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-champagne-600">
                  STEP 04
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-ink-950 mt-1">
                  Who is in your travel party?
                </h2>
                <p className="text-xs sm:text-sm text-stone-600 mt-1">
                  We adapt activity recommendations and room allocations based on your companions.
                </p>
              </div>

              {/* Group Type Selector */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-2">
                  Group Profile
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {(['solo', 'couple', 'family', 'friends'] as GroupType[]).map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setTravellers({ ...travellers, groupType: type })}
                      className={`p-3 rounded-xl border text-xs font-bold uppercase tracking-wider capitalize transition-all ${
                        travellers.groupType === type
                          ? 'border-champagne-500 bg-champagne-100 text-ink-950 shadow-soft'
                          : 'border-stone-200 text-stone-700 hover:bg-stone-50'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Guest Counts */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-2">
                <div className="p-4 rounded-xl border border-stone-200 bg-stone-50 text-center">
                  <span className="text-xs font-bold uppercase tracking-wider text-stone-600 block mb-2">
                    Adults (12+ yrs)
                  </span>
                  <div className="flex items-center justify-center space-x-3">
                    <button
                      type="button"
                      onClick={() =>
                        setTravellers({ ...travellers, adults: Math.max(1, travellers.adults - 1) })
                      }
                      className="w-8 h-8 rounded-full border border-stone-300 text-lg font-bold flex items-center justify-center hover:bg-stone-200"
                    >
                      -
                    </button>
                    <span className="font-serif text-2xl font-bold text-ink-900 w-8">
                      {travellers.adults}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        setTravellers({ ...travellers, adults: travellers.adults + 1 })
                      }
                      className="w-8 h-8 rounded-full border border-stone-300 text-lg font-bold flex items-center justify-center hover:bg-stone-200"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-stone-200 bg-stone-50 text-center">
                  <span className="text-xs font-bold uppercase tracking-wider text-stone-600 block mb-2">
                    Children (2-11 yrs)
                  </span>
                  <div className="flex items-center justify-center space-x-3">
                    <button
                      type="button"
                      onClick={() =>
                        setTravellers({ ...travellers, children: Math.max(0, travellers.children - 1) })
                      }
                      className="w-8 h-8 rounded-full border border-stone-300 text-lg font-bold flex items-center justify-center hover:bg-stone-200"
                    >
                      -
                    </button>
                    <span className="font-serif text-2xl font-bold text-ink-900 w-8">
                      {travellers.children}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        setTravellers({ ...travellers, children: travellers.children + 1 })
                      }
                      className="w-8 h-8 rounded-full border border-stone-300 text-lg font-bold flex items-center justify-center hover:bg-stone-200"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-stone-200 bg-stone-50 text-center">
                  <span className="text-xs font-bold uppercase tracking-wider text-stone-600 block mb-2">
                    Rooms Required
                  </span>
                  <div className="flex items-center justify-center space-x-3">
                    <button
                      type="button"
                      onClick={() =>
                        setTravellers({ ...travellers, rooms: Math.max(1, travellers.rooms - 1) })
                      }
                      className="w-8 h-8 rounded-full border border-stone-300 text-lg font-bold flex items-center justify-center hover:bg-stone-200"
                    >
                      -
                    </button>
                    <span className="font-serif text-2xl font-bold text-ink-900 w-8">
                      {travellers.rooms}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        setTravellers({ ...travellers, rooms: travellers.rooms + 1 })
                      }
                      className="w-8 h-8 rounded-full border border-stone-300 text-lg font-bold flex items-center justify-center hover:bg-stone-200"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* Accessibility & Mobility */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-2">
                  Accessibility & Mobility Considerations
                </label>
                <select
                  value={travellers.mobilityRequirements}
                  onChange={(e) =>
                    setTravellers({
                      ...travellers,
                      mobilityRequirements: e.target.value as MobilityRequirement,
                    })
                  }
                  className="w-full px-4 py-3 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-champagne-400 focus:outline-none bg-white"
                >
                  <option value="standard">Standard (Comfortable with moderate walking & stairs)</option>
                  <option value="low-walking">Low-Walking / Gentle Pace (Prefers scenic drives & level pathways)</option>
                  <option value="elderly-friendly">Elderly-Friendly (Avoids steep stair climbs)</option>
                  <option value="wheelchair-accessible">Wheelchair / Step-Free Accessible</option>
                  <option value="infant-friendly">Infant & Toddler Friendly (Pram friendly, regular rest stops)</option>
                </select>
              </div>
            </div>
          )}

          {/* STEP 5: ACCOMMODATION */}
          {currentStep === 5 && (
            <div className="space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-champagne-600">
                  STEP 05
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-ink-950 mt-1">
                  Accommodation Standards in {destinationLabel}
                </h2>
                <p className="text-xs sm:text-sm text-stone-600 mt-1">
                  Choose your preferred hospitality tier. We match verified properties with direct official booking links.
                </p>
              </div>

              {/* Star Category */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-2">
                  Hotel Category
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  {(
                    [
                      { id: '3-star', label: '3-Star Comfort' },
                      { id: '4-star', label: '4-Star Premium' },
                      { id: '5-star', label: '5-Star Luxury' },
                      { id: 'heritage', label: 'Heritage / Boutique' },
                      { id: 'no-preference', label: 'No Preference' },
                    ] as { id: HotelCategory; label: string }[]
                  ).map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setAccommodation({ ...accommodation, category: cat.id })}
                      className={`p-3 rounded-xl border text-xs font-semibold text-center transition-all ${
                        accommodation.category === cat.id
                          ? 'border-champagne-500 bg-champagne-100 text-ink-950 shadow-soft'
                          : 'border-stone-200 text-stone-700 hover:bg-stone-50'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Room Quality */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-2">
                  Room Quality
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {(['standard', 'deluxe', 'premium', 'suite'] as RoomQuality[]).map((quality) => (
                    <button
                      key={quality}
                      type="button"
                      onClick={() => setAccommodation({ ...accommodation, roomQuality: quality })}
                      className={`p-3 rounded-xl border text-xs font-bold uppercase tracking-wider capitalize transition-all ${
                        accommodation.roomQuality === quality
                          ? 'border-champagne-500 bg-champagne-100 text-ink-950 shadow-soft'
                          : 'border-stone-200 text-stone-700 hover:bg-stone-50'
                      }`}
                    >
                      {quality}
                    </button>
                  ))}
                </div>
              </div>

              {/* Nightly Budget & Area */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-2">
                    Approximate Nightly Room Budget: ₹{accommodation.maxNightlyBudget.toLocaleString('en-IN')}
                  </label>
                  <input
                    type="range"
                    min="3500"
                    max="45000"
                    step="1000"
                    value={accommodation.maxNightlyBudget}
                    onChange={(e) =>
                      setAccommodation({ ...accommodation, maxNightlyBudget: Number(e.target.value) })
                    }
                    className="w-full accent-champagne-600"
                  />
                  <div className="flex justify-between text-[10px] text-stone-500 mt-1">
                    <span>₹3,500 (Budget)</span>
                    <span>₹15,000 (Upscale)</span>
                    <span>₹45,000+ (Luxury)</span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-2">
                    Preferred Hotel Area in {destinationLabel}
                  </label>
                  <input
                    type="text"
                    value={accommodation.preferredArea || ''}
                    onChange={(e) =>
                      setAccommodation({ ...accommodation, preferredArea: e.target.value })
                    }
                    placeholder={`e.g. ${activeBundle?.defaultPreferredArea || 'Central'}`}
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-champagne-400 focus:outline-none"
                  />
                </div>
              </div>

              {/* Hotel Shortlist Preview */}
              {activeBundle && activeBundle.hotels.length > 0 && (
                <div className="pt-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-stone-700 block mb-3">
                    Matching Curated Properties in {destinationLabel}
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {activeBundle.hotels.slice(0, 2).map((hotel) => (
                      <div
                        key={hotel.id}
                        className="p-3 rounded-xl border border-stone-200 bg-stone-50 flex items-center space-x-3"
                      >
                        <img
                          src={hotel.image}
                          alt={hotel.name}
                          className="w-14 h-14 rounded-lg object-cover shrink-0"
                          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs font-bold text-ink-900 truncate">{hotel.name}</h4>
                          <p className="text-[11px] text-stone-500">{hotel.area} • {hotel.category.toUpperCase()}</p>
                          <p className="text-xs font-semibold text-champagne-700 mt-0.5">
                            Indicative ~₹{hotel.basePriceInr.toLocaleString('en-IN')} / night
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <p className="text-[11px] text-stone-500 italic mt-2">
                    * All hotel tariffs are estimates and subject to direct confirmation with properties.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* STEP 6: PACE, FOOD & INTERESTS */}
          {currentStep === 6 && (
            <div className="space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-champagne-600">
                  STEP 06
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-ink-950 mt-1">
                  Pace, Dining & Must-Visit Attractions
                </h2>
                <p className="text-xs sm:text-sm text-stone-600 mt-1">
                  Choose how much to explore at each stop and set your culinary preferences for {destinationLabel}.
                </p>
              </div>

              {/* Food Preference */}
              <div className="p-5 rounded-xl border-2 border-sage-300 bg-sage-50/60 space-y-3">
                <div className="flex items-center space-x-2">
                  <Utensils className="w-4 h-4 text-sage-700" />
                  <label className="text-xs font-bold uppercase tracking-wider text-sage-900">
                    Food & Dietary Preference (Crucial)
                  </label>
                </div>
                <p className="text-xs text-stone-600">
                  WAYFARER features verified pure-vegetarian establishments and traditional regional cuisine for {destinationLabel}.
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                  {(
                    [
                      { id: 'pure-veg', label: 'Pure Vegetarian' },
                      { id: 'jain', label: 'Jain-Friendly' },
                      { id: 'vegan', label: 'Vegan' },
                      { id: 'vegetarian', label: 'Vegetarian' },
                      { id: 'no-preference', label: 'No Preference' },
                    ] as { id: FoodPreference; label: string }[]
                  ).map((food) => (
                    <button
                      key={food.id}
                      type="button"
                      onClick={() => setFoodPreference(food.id)}
                      className={`p-2.5 rounded-lg text-xs font-bold transition-all text-center ${
                        foodPreference === food.id
                          ? 'bg-sage-700 text-white shadow-soft'
                          : 'bg-white border border-stone-200 text-stone-700 hover:bg-stone-50'
                      }`}
                    >
                      {food.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Travel Pace */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-2">
                  Travel Pace
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    {
                      id: 'relaxed' as TravelPace,
                      title: 'Relaxed Pace',
                      desc: '                      Fewer planned highlights with more room to linger and explore independently.',
                    },
                    {
                      id: 'balanced' as TravelPace,
                      title: 'Balanced Rhythm',
                      desc: '                      A balanced mix of key highlights and flexible time for discovery.',
                    },
                    {
                      id: 'packed' as TravelPace,
                      title: 'Packed / Comprehensive',
                      desc: '                      More highlights across the route with less unstructured time.',
                    },
                  ].map((pace) => (
                    <div
                      key={pace.id}
                      onClick={() => setTravelPace(pace.id)}
                      className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        travelPace === pace.id
                          ? 'border-champagne-500 bg-champagne-50/50 shadow-soft'
                          : 'border-stone-200 hover:border-stone-300'
                      }`}
                    >
                      <h4 className="font-serif text-sm font-bold text-ink-900">{pace.title}</h4>
                      <p className="text-xs text-stone-600 mt-1 leading-relaxed">{pace.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Must-Visit Attractions from Active Bundle */}
              {activeBundle && activeBundle.attractions.length > 0 && (
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-2">
                    Must-Visit Landmarks in {destinationLabel} (Pinned to Itinerary)
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {activeBundle.attractions.slice(0, 8).map((att) => {
                      const isSelected = mustVisitAttractions.includes(att.id);
                      return (
                        <button
                          key={att.id}
                          type="button"
                          onClick={() => toggleMustVisit(att.id)}
                          className={`p-3 rounded-xl border text-left text-xs transition-all flex items-center justify-between ${
                            isSelected
                              ? 'border-champagne-500 bg-champagne-50 font-bold text-ink-950'
                              : 'border-stone-200 text-stone-700 hover:bg-stone-50'
                          }`}
                        >
                          <span className="truncate pr-2">{att.name}</span>
                          <span
                            className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] shrink-0 ${
                              isSelected ? 'bg-champagne-600 text-white' : 'border border-stone-300'
                            }`}
                          >
                            {isSelected ? '✓' : ''}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Interests */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-2">
                  Key Travel Interests
                </label>
                <div className="flex flex-wrap gap-2">
                  {(
                    [
                      { id: 'nature', label: 'Nature & Scenery' },
                      { id: 'adventure', label: 'Adventure & Trails' },
                      { id: 'culture', label: 'Heritage & Traditional Arts' },
                      { id: 'photography', label: 'Scenic Photography' },
                      { id: 'shopping', label: 'Local Handicrafts & Spices' },
                      { id: 'spiritual', label: 'Temples & Sacred Shrines' },
                      { id: 'relaxation', label: 'Waterways & Leisure' },
                    ] as { id: InterestCategory; label: string }[]
                  ).map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => toggleInterest(item.id)}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                        selectedInterests.includes(item.id)
                          ? 'bg-ink-900 text-ivory-50 shadow-sm'
                          : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                      }`}
                    >
                      {selectedInterests.includes(item.id) ? '✓ ' : '+ '}
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 7: REVIEW PREFERENCES */}
          {currentStep === 7 && (
            <div className="space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-champagne-600">
                  STEP 07 — FINAL REVIEW
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-ink-950 mt-1">
                  Review Your Travel Blueprint
                </h2>
                <p className="text-xs sm:text-sm text-stone-600 mt-1">
                  Verify your selections before WAYFARER generates your personalized {destinationLabel} itinerary.
                </p>
              </div>

              {/* Blueprint Summary Card */}
              <div className="border border-stone-300 rounded-2xl overflow-hidden bg-white shadow-soft">
                {/* Destination Hero Banner */}
                <div className="relative h-44 w-full bg-stone-200">
                  <img
                    src={selectedDestination?.heroImage ?? ''}
                    alt={destinationLabel}
                    className="w-full h-full object-cover"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink-950/85 via-ink-950/30 to-transparent flex flex-col justify-end p-6 text-white">
                    <span className="text-[10px] uppercase font-bold tracking-widest text-champagne-300">
                      DESTINATION BLUEPRINT
                    </span>
                    <h3 className="font-serif text-2xl font-bold text-white">
                      {destinationLabel}
                    </h3>
                    <p className="text-xs text-stone-200">{durationDays} Days / {durationDays - 1} Nights ({departureDate} to {returnDate})</p>
                  </div>
                </div>

                {/* Grid of Choices */}
                <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs divide-y sm:divide-y-0 sm:divide-x divide-stone-200">
                  <div className="space-y-3.5 pr-2">
                    <div className="flex justify-between items-center">
                      <span className="text-stone-500 font-semibold uppercase tracking-wider">Party Size</span>
                      <button
                        onClick={() => setCurrentStep(4)}
                        className="text-champagne-700 hover:underline font-bold"
                      >
                        Edit
                      </button>
                    </div>
                    <p className="font-bold text-sm text-ink-900">
                      {travellers.adults} Adults, {travellers.children} Children ({travellers.groupType})
                    </p>
                    <p className="text-stone-600">
                      Mobility: <strong className="capitalize">{travellers.mobilityRequirements}</strong>
                    </p>

                    <div className="pt-3 border-t border-stone-200 flex justify-between items-center">
                      <span className="text-stone-500 font-semibold uppercase tracking-wider">Transit Logistics</span>
                      <button
                        onClick={() => setCurrentStep(3)}
                        className="text-champagne-700 hover:underline font-bold"
                      >
                        Edit
                      </button>
                    </div>
                    <p className="text-stone-700">
                      <strong>Onward:</strong> By {onwardTransport.mode} ({onwardTransport.departureLocation} → {onwardTransport.arrivalLocation})
                    </p>
                    <p className="text-stone-700">
                      <strong>Return:</strong> By {returnTransport.mode} ({returnTransport.departureLocation} → {returnTransport.arrivalLocation})
                    </p>
                  </div>

                  <div className="space-y-3.5 sm:pl-6 pt-4 sm:pt-0">
                    <div className="flex justify-between items-center">
                      <span className="text-stone-500 font-semibold uppercase tracking-wider">Hospitality & Food</span>
                      <button
                        onClick={() => setCurrentStep(5)}
                        className="text-champagne-700 hover:underline font-bold"
                      >
                        Edit
                      </button>
                    </div>
                    <p className="font-bold text-sm text-ink-900">
                      {accommodation.category.toUpperCase()} ({accommodation.roomQuality.toUpperCase()})
                    </p>
                    <p className="text-stone-600">
                      Rooms: <strong>{travellers.rooms} Room(s)</strong> • Budget ~₹{accommodation.maxNightlyBudget.toLocaleString('en-IN')}/night
                    </p>
                    <p className="text-sage-800 bg-sage-50 p-2 rounded border border-sage-200">
                      <strong>Food Preference:</strong> {foodPreference.toUpperCase()} (Curated {destinationLabel} dining)
                    </p>

                    <div className="pt-3 border-t border-stone-200 flex justify-between items-center">
                      <span className="text-stone-500 font-semibold uppercase tracking-wider">Pace & Must-Visits</span>
                      <button
                        onClick={() => setCurrentStep(6)}
                        className="text-champagne-700 hover:underline font-bold"
                      >
                        Edit
                      </button>
                    </div>
                    <p className="text-stone-700 capitalize">
                      <strong>Pace:</strong> {travelPace} • {mustVisitAttractions.length} Must-Visit landmark(s) pinned
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Controls */}
          <div className="mt-10 pt-6 border-t border-stone-200 flex items-center justify-between">
            <button
              onClick={handleBack}
              className="px-5 py-2.5 rounded-full border border-stone-300 text-stone-700 hover:bg-stone-50 text-xs font-semibold uppercase tracking-wider transition-all flex items-center space-x-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{currentStep === 1 ? 'Cancel' : 'Back'}</span>
            </button>

            {currentStep < totalSteps ? (
              <button
                onClick={handleNext}
                disabled={
                  (currentStep === 1 && !isSupported) ||
                  (currentStep === 2 && !dateValidation.isValid)
                }
                className="px-7 py-3 rounded-full bg-ink-900 text-ivory-50 hover:bg-ink-800 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-semibold uppercase tracking-wider transition-all shadow-sm flex items-center space-x-2"
              >
                <span>
                  {currentStep === 1 && !isSupported
                    ? 'Curated Data Required'
                    : currentStep === 2 && !dateValidation.isValid
                    ? 'Fix Date Errors to Continue'
                    : 'Continue'}
                </span>
                <ArrowRight className="w-4 h-4 text-champagne-400" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={!isSupported}
                className="px-8 py-3.5 rounded-full bg-champagne-500 hover:bg-champagne-600 disabled:opacity-40 text-ink-950 font-bold text-xs uppercase tracking-widest transition-all shadow-elevated active:scale-95 flex items-center space-x-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>Create My Itinerary</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
