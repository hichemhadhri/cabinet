import   { Calendar } from '@fullcalendar/core';
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
var socket = io();


  document.addEventListener('DOMContentLoaded', function() {
    var calendarEl = document.getElementById('calendar');

    var calendar = new FullCalendar.Calendar(calendarEl, {
     plugins: [ 'interaction', 'dayGrid','timeGrid' ],
      selectable: true,

header: {
  left: 'prev,next today',
  center: 'title'

},
businessHours: {
// days of week. an array of zero-based day of week integers (0=Sunday)
daysOfWeek: [ 1, 2, 3, 4,5 ], // Monday - Thursday

startTime: '10:00', // a start time (10am in this example)
endTime: '18:00', // an end time (6pm in this example)
},

      select: function(info) {
        console.log(calendar.view.type);
        console.log(calendar.view.type == 'timeGrid');
  alert('selected ' + info.startStr + ' to ' + info.endStr );
  if(calendar.view.type !='timeGrid')
  {
  calendar.changeView('timeGrid', {
start: info.startStr,
end: info.endStr
});  // change view of the calendar to display hours
} else {
calendar.addEvent({
          title: 'dynamic event',
          start: info.startStr,
          end: info.endStr
});
socket.emit('nvrdv',{start :info.startStr ,end : info.endStr });
}

}

    });


    calendar.render();


  });
