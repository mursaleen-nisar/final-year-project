import { useEffect, useState } from "react";
import { gapi } from "gapi-script";
import ReactCalendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import styled, { ThemeProvider, createGlobalStyle } from 'styled-components';

const CLIENT_ID = "40876243376-cp1tei584hlj6o6k1ciso41a91qqvq4m.apps.googleusercontent.com";
const API_KEY = "AIzaSyCYLpK6jtBNDo0Vz7pO5i6lyNt5CL31WkE";
const SCOPES = "https://www.googleapis.com/auth/calendar.readonly";

const lightTheme = {
  background: '#ffffff',
  text: '#333333',
  primary: '#4285f4',
  secondary: '#f0f8ff',
  accent: '#3367d6',
  border: '#e0e0e0',
  cardBg: '#ffffff',
  calendarTileBg: '#ffffff',
  calendarTileHover: '#f5f5f5',
  eventBackground: '#f8f9fa',
  hoverBackground: '#eaeaea',
  errorBackground: '#ffebee',
  errorText: '#d32f2f'
};

const darkTheme = {
  background: '#1e1e1e',
  text: '#f5f5f5',
  primary: '#5c9aff',
  secondary: '#2a2d3e',
  accent: '#7dabf8',
  border: '#444444',
  cardBg: '#2d2d2d',
  calendarTileBg: '#2d2d2d',
  calendarTileHover: '#3d3d3d',
  eventBackground: '#3d3d3d',
  hoverBackground: '#3a3a3a',
  errorBackground: '#4a1010',
  errorText: '#ff6b6b'
};

const GlobalStyle = createGlobalStyle`
  body {
    background-color: ${props => props.theme.background};
    color: ${props => props.theme.text};
    transition: all 0.3s ease;
  }
`;

const ThemeToggle = styled.button`
  position: absolute;
  top: 20px;
  right: 20px;
  background: ${props => props.theme.primary};
  color: white;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 2px 5px rgba(0,0,0,0.2);
  transition: all 0.3s ease;
  
  &:hover {
    background: ${props => props.theme.accent};
    transform: scale(1.05);
  }
`;

// Styled components for the calendar
const EventDot = styled.div`
  height: 8px;
  width: 8px;
  background-color: ${props => props.theme.primary};
  border-radius: 50%;
  display: inline-block;
  margin: 1px;
`;

const CalendarContainer = styled.div`
  position: relative;
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  
  .react-calendar {
    width: 100%;
    border: 1px solid ${props => props.theme.border};
    border-radius: 8px;
    padding: 16px;
    background-color: ${props => props.theme.cardBg};
    color: ${props => props.theme.text};
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    transition: all 0.3s ease;
    
    .react-calendar__navigation {
      height: 50px;
      margin-bottom: 20px;
      
      button {
        background: none;
        color: ${props => props.theme.text};
        font-size: 1rem;
        border: none;
        border-radius: 4px;
        
        &:hover, &:focus {
          background-color: ${props => props.theme.hoverBackground};
        }
        
        &:disabled {
          opacity: 0.5;
        }
      }
      
      .react-calendar__navigation__label {
        font-weight: bold;
        font-size: 1.1rem;
      }
    }
    
    .react-calendar__month-view__weekdays {
      color: ${props => props.theme.primary};
      font-weight: bold;
      text-transform: uppercase;
      font-size: 0.8rem;
      
      abbr {
        text-decoration: none;
        cursor: default;
      }
    }
    
    .react-calendar__tile {
      height: 80px;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: center;
      padding: 8px 0;
      background: ${props => props.theme.calendarTileBg};
      color: ${props => props.theme.text};
      border-radius: 4px;
      transition: all 0.2s;
      
      &:hover {
        background-color: ${props => props.theme.calendarTileHover};
      }
      
      &.react-calendar__tile--active {
        background: ${props => props.theme.secondary};
        color: ${props => props.theme.text};
      }
      
      &.react-calendar__tile--now {
        background-color: ${props => props.theme.secondary};
        border: 2px solid ${props => props.theme.primary};
      }
    }
    
    .react-calendar__month-view__days__day--weekend {
      color: ${props => props.isDark ? '#ff8a80' : '#d32f2f'};
    }
    
    .react-calendar__month-view__days__day--neighboringMonth {
      opacity: 0.5;
    }
  }
  
  .has-events {
    background-color: ${props => props.theme.secondary} !important;
    font-weight: bold;
  }
  
  .calendar-day-content {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  
  .date-number {
    margin-bottom: 4px;
    font-size: 1rem;
    font-weight: ${props => props.theme === darkTheme ? 'normal' : 'bold'};
  }
  
  .events-container {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    margin-top: 4px;
  }
`;

const PageTitle = styled.h2`
  color: ${props => props.theme.text};
  margin-bottom: 20px;
  text-align: center;
  font-size: 1.8rem;
  font-weight: bold;
`;

const EventDetailsCard = styled.div`
  margin-top: 20px;
  padding: 20px;
  border-radius: 8px;
  background-color: ${props => props.theme.cardBg};
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  transition: all 0.3s ease;
  
  h3 {
    color: ${props => props.theme.text};
    margin-bottom: 16px;
    border-bottom: 1px solid ${props => props.theme.border};
    padding-bottom: 8px;
    font-weight: 600;
  }
`;

const EventItem = styled.div`
  margin-bottom: 12px;
  padding: 12px;
  background-color: ${props => props.theme.eventBackground};
  border-radius: 6px;
  border-left: 3px solid ${props => props.theme.primary};
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateX(2px);
    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
  }
  
  h4 {
    color: ${props => props.theme.text};
    margin-bottom: 8px;
  }
  
  p {
    color: ${props => props.theme.text};
    margin: 5px 0;
    font-size: 0.9rem;
  }
  
  strong {
    color: ${props => props.theme.primary};
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  
  button {
    padding: 10px 18px;
    background-color: ${props => props.theme.primary};
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-weight: 500;
    transition: all 0.2s ease;
    
    &:hover {
      background-color: ${props => props.theme.accent};
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    }
    
    &:disabled {
      opacity: 0.7;
      cursor: not-allowed;
      transform: none;
    }
  }
`;

const ErrorMessage = styled.div`
  color: ${props => props.theme.errorText};
  margin: 10px 0;
  padding: 10px;
  background-color: ${props => props.theme.errorBackground};
  border-radius: 4px;
  border-left: 4px solid ${props => props.theme.errorText};
`;

const LoadingMessage = styled.p`
  text-align: center;
  margin: 20px 0;
  color: ${props => props.theme.primary};
  font-style: italic;
`;

const CalendarPage = () => {
  const [events, setEvents] = useState([]);
  const [date, setDate] = useState(new Date());
  const [eventsByDate, setEventsByDate] = useState({});
  const [selectedDateEvents, setSelectedDateEvents] = useState([]);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Check system preference for dark mode
    const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setIsDarkMode(prefersDarkMode);
    
    const initializeGapi = async () => {
      try {
        setIsLoading(true);
        await gapi.load("client:auth2", async () => {
          try {
            await gapi.client.init({
              apiKey: API_KEY,
              clientId: CLIENT_ID,
              scope: SCOPES,
              discoveryDocs: ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"],
            });
            
            // Check if user is already signed in
            const isSignedIn = gapi.auth2.getAuthInstance().isSignedIn.get();
            setIsSignedIn(isSignedIn);
            
            if (isSignedIn) {
              listUpcomingEvents();
            }
            
            // Add listener to update UI if auth status changes
            gapi.auth2.getAuthInstance().isSignedIn.listen((isSignedIn) => {
              setIsSignedIn(isSignedIn);
              if (isSignedIn) {
                listUpcomingEvents();
              }
            });
            
          } catch (initError) {
            console.error("Error initializing GAPI client", initError);
            setError("Failed to initialize Google API client");
          }
        });
      } catch (err) {
        console.error("Error loading GAPI client", err);
        setError("Failed to load Google API client");
      } finally {
        setIsLoading(false);
      }
    };
    
    initializeGapi();
  }, []);

  // Organize events by date when events state changes
  useEffect(() => {
    const eventMap = {};
    events.forEach(event => {
      if (!event.start) {
        return;
      }
      
      try {
        const eventDate = new Date(event.start.dateTime || event.start.date);
        const dateStr = eventDate.toDateString();
        
        if (!eventMap[dateStr]) {
          eventMap[dateStr] = [];
        }
        eventMap[dateStr].push(event);
      } catch (err) {
        console.error("Error processing event date:", err, event);
      }
    });
    
    setEventsByDate(eventMap);
    
    // Update selected date events
    updateSelectedDateEvents(date);
  }, [events, date]);

  const updateSelectedDateEvents = (selectedDate) => {
    const dateStr = selectedDate.toDateString();
    setSelectedDateEvents(eventsByDate[dateStr] || []);
  };

  const handleAuthClick = async () => {
    try {
      setIsLoading(true);
      await gapi.auth2.getAuthInstance().signIn();
      setIsSignedIn(true);
      await listUpcomingEvents();
    } catch (err) {
      console.error("Auth error:", err);
      setError("Authentication failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOutClick = () => {
    try {
      gapi.auth2.getAuthInstance().signOut();
      setIsSignedIn(false);
      setEvents([]);
      setEventsByDate({});
      setSelectedDateEvents([]);
    } catch (err) {
      console.error("Sign out error:", err);
    }
  };

  const listUpcomingEvents = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Get the current month's start and two months later for range
      const startDate = new Date();
      startDate.setDate(1); // Start of current month
      
      const endDate = new Date();
      endDate.setMonth(endDate.getMonth() + 2);
      endDate.setDate(0); // End of next month
      
      const response = await gapi.client.calendar.events.list({
        calendarId: "primary",
        timeMin: startDate.toISOString(),
        timeMax: endDate.toISOString(),
        showDeleted: false,
        singleEvents: true,
        maxResults: 100,
        orderBy: "startTime",
      });
      
      if (response.result.items && response.result.items.length > 0) {
        setEvents(response.result.items);
      } else {
        console.log("No events found in the specified time range");
        setEvents([]);
      }
    } catch (error) {
      console.error("Error fetching events", error);
      setError("Failed to load calendar events. " + error.message);
      setEvents([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDateChange = (newDate) => {
    setDate(newDate);
    updateSelectedDateEvents(newDate);
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  // Function to render custom tile content with event indicators
  const tileContent = ({ date, view }) => {
    if (view !== 'month') return null;
    
    const dateStr = date.toDateString();
    const hasEvents = eventsByDate[dateStr] && eventsByDate[dateStr].length > 0;
    
    return (
      <div className="calendar-day-content">
        <div className="date-number">{date.getDate()}</div>
        {hasEvents && (
          <div className="events-container">
            {eventsByDate[dateStr].slice(0, 3).map((_, i) => (
              <EventDot key={i} theme={isDarkMode ? darkTheme : lightTheme} />
            ))}
            {eventsByDate[dateStr].length > 3 && <span>+{eventsByDate[dateStr].length - 3}</span>}
          </div>
        )}
      </div>
    );
  };

  // Function to add a class to tiles with events
  const tileClassName = ({ date }) => {
    const dateStr = date.toDateString();
    return eventsByDate[dateStr] && eventsByDate[dateStr].length > 0 ? 'has-events' : null;
  };

  // Format event time for display
  const formatEventTime = (event) => {
    if (event.start.dateTime) {
      const start = new Date(event.start.dateTime);
      const end = new Date(event.end.dateTime);
      return `${start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    }
    return 'All day';
  };

  const currentTheme = isDarkMode ? darkTheme : lightTheme;

  return (
    <ThemeProvider theme={currentTheme}>
      <GlobalStyle />
      <CalendarContainer theme={currentTheme} isDark={isDarkMode}>
        <ThemeToggle onClick={toggleTheme} theme={currentTheme}>
          {isDarkMode ? '☀️' : '🌙'}
        </ThemeToggle>
        
        <PageTitle theme={currentTheme}>Calendar</PageTitle>
        
        {error && (
          <ErrorMessage theme={currentTheme}>
            Error: {error}
          </ErrorMessage>
        )}
        
        <ButtonContainer theme={currentTheme}>
          {!isSignedIn ? (
            <button onClick={handleAuthClick} disabled={isLoading}>
              {isLoading ? 'Connecting...' : 'Sign in with Google'}
            </button>
          ) : (
            <>
              <button onClick={handleSignOutClick}>Sign out</button>
              <button onClick={listUpcomingEvents} disabled={isLoading}>
                {isLoading ? 'Loading...' : 'Refresh Events'}
              </button>
            </>
          )}
        </ButtonContainer>

        {isLoading && <LoadingMessage theme={currentTheme}>Loading calendar data...</LoadingMessage>}

        {isSignedIn && (
          <>
            <ReactCalendar
              onChange={handleDateChange}
              value={date}
              tileContent={tileContent}
              tileClassName={tileClassName}
              formatDay={() => ''} // Fix for duplicate date display
            />
            
            <EventDetailsCard theme={currentTheme}>
              <h3>Events for {date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</h3>
              {isLoading ? (
                <LoadingMessage theme={currentTheme}>Loading events...</LoadingMessage>
              ) : selectedDateEvents.length > 0 ? (
                selectedDateEvents.map((event) => (
                  <EventItem key={event.id} theme={currentTheme}>
                    <h4>{event.summary}</h4>
                    <p>{formatEventTime(event)}</p>
                    {event.location && <p><strong>Location:</strong> {event.location}</p>}
                    {event.description && <p><strong>Description:</strong> {event.description}</p>}
                  </EventItem>
                ))
              ) : (
                <p>No events scheduled for this date.</p>
              )}
            </EventDetailsCard>
          </>
        )}

        {/* Always show calendar even if no events */}
        {!isSignedIn && !isLoading && (
          <div style={{ textAlign: 'center', margin: '20px 0' }}>
            <p>Please sign in with Google to view your calendar events.</p>
            <ReactCalendar
              onChange={setDate}
              value={date}
              formatDay={(_, date) => date.getDate()} // Fix for duplicate date display
            />
          </div>
        )}
      </CalendarContainer>
    </ThemeProvider>
  );
};

export default CalendarPage;