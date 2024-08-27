import { useEffect, useState } from "react";
import * as rdds from "react-device-detect";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { useSettings } from "src/@core/hooks/useSettings";
import ApexChartWrapper from "src/@core/styles/libs/react-apexcharts";
import EcommerceCongratulations from "src/views/dashboards/ecommerce/EcommerceCongratulations";
import Calendar from "src/views/apps/calendar/Calendar";
import CalendarWrapper from "src/@core/styles/libs/fullcalendar";
import {
  fetchEvents,
  updateEvent,
  handleSelectEvent,
} from "src/store/apps/calendar";
import ListOrderDrawer from "src/views/dashboards/ListOrderDrawer";
import { listOrderDashboard } from "src/services/dashboard";
import Head from "next/head";

// ** CalendarColors
const calendarsColor = {
  Unit: "primary",
  Homecare: "info",
  Telenursing: "warning",
};

const EcommerceDashboard = () => {
  // ** States
  const [loading, setLoading] = useState(true);
  const [calendarApi, setCalendarApi] = useState(null);
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(false);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [dataList, setDataList] = useState([]);
  const [dataStore, setDataStore] = useState({ events: [] });
  const [selectedEvent, setSelectedEvent] = useState([]);

  // ** Hooks
  const { settings } = useSettings();
  const dispatch = useDispatch();
  const store = useSelector((state) => state.calendar);

  // ** Vars
  const { skin, direction } = settings;
  const mdAbove = useMediaQuery((theme) => theme.breakpoints.up("md"));
  useEffect(() => {
    dispatch(fetchEvents(store.selectedCalendars));
  }, [dispatch, store.selectedCalendars]);
  const handleLeftSidebarToggle = () => setLeftSidebarOpen(!leftSidebarOpen);

  const handleAddEventSidebarToggle = (e) => {
    const tempSelectedEvent = dataStore?.events[+e?.id]?.order_list;

    const mappingEventList = tempSelectedEvent.map((item) => {
      return {
        id: item?.order_id,
        type: e?._def?.extendedProps?.calendar.toLowerCase(),
        ...item,
      };
    });
    setSelectedEvent(mappingEventList);
    setOpenDrawer(!openDrawer);
  };

  const fetchDataList = async () => {
    const res = await listOrderDashboard();
    if (+res?.result?.status === 200) {
      const data = res?.result?.data !== null ? res?.result?.data : [];

      if (+data.length > 0) {
        setLoading(false);
        let tempDataStore = [];

        const mappingDataList = data.map((item, index) => {
          return {
            id: index,
            events: [...item?.order_list],
            extendedProps: { calendar: item?.type },
            ...item,
          };
        });

        tempDataStore = {
          events: [...mappingDataList],
          selectedCalendars: ["Unit", "Homecare", "Telenursing"],
        };
        setDataList(mappingDataList);
        setDataStore(tempDataStore);
      } else {
        setLoading(false);
        setDataList([]);
      }
    } else {
      setLoading(false);
      toast.error(`Opps ! ${res?.error} ${res?.status}`);
      if (+res?.status === 401) {
        logout();
      }
    }
  };

  useEffect(() => {
    fetchDataList();
  }, []);

  return (
    <>
      <Head>
        <title>Dashboards | KlinikKu</title>
      </Head>
      <ApexChartWrapper>
        <Grid container spacing={6}>
          <Grid item xs={12} md={12} sx={{ order: 0, alignSelf: "flex-end" }}>
            <EcommerceCongratulations />
          </Grid>
          <Grid item xs={12} md={12} sx={{ order: 0 }}>
            <CalendarWrapper
              className="app-calendar"
              sx={{
                boxShadow: skin === "bordered" ? 0 : 6,
                ...(skin === "bordered" && {
                  border: (theme) => `1px solid ${theme.palette.divider}`,
                }),
              }}
            >
              <Box
                sx={{
                  p: 5,
                  pb: 0,
                  flexGrow: 1,
                  borderRadius: 1,
                  boxShadow: "none",
                  backgroundColor: "background.paper",
                  ...(mdAbove
                    ? { borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }
                    : {}),
                }}
              >
                <Calendar
                  store={dataStore}
                  dispatch={dispatch}
                  direction={direction}
                  updateEvent={updateEvent}
                  calendarApi={calendarApi}
                  calendarsColor={calendarsColor}
                  setCalendarApi={setCalendarApi}
                  handleSelectEvent={handleSelectEvent}
                  handleLeftSidebarToggle={handleLeftSidebarToggle}
                  handleAddEventSidebarToggle={handleAddEventSidebarToggle}
                />
              </Box>
            </CalendarWrapper>
          </Grid>
        </Grid>
        <ListOrderDrawer
          open={openDrawer}
          toggle={() => setOpenDrawer(!openDrawer)}
          dataList={selectedEvent}
        />
      </ApexChartWrapper>
    </>
  );
};

export default EcommerceDashboard;
