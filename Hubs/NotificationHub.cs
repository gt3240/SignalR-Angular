using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.AspNet.SignalR;
using Sabio.Web.signalr;
using System.Threading.Tasks;

namespace Sabio.Web.Hubs
{
    [Authorize]
    public class NotificationHub : Hub
    {

        #region Data Members

        static List<UserDetail> ConnectedUsers = new List<UserDetail>();

        #endregion

        public void Connect(string userName, string userId)
        {
            var conId = Context.ConnectionId;

            if (ConnectedUsers.Count(x => x.ConnectionId == conId) == 0)
            {
                ConnectedUsers.Add(new UserDetail { ConnectionId = conId, UserName = userName, UserId = userId });
                Clients.All.onConnected(userName);
            }

            
        }

        public override Task OnDisconnected(bool stopCalled)
        {
            var item = ConnectedUsers.FirstOrDefault(x => x.ConnectionId == Context.ConnectionId);
            if (item != null)
            {
                ConnectedUsers.Remove(item);
            }
            return base.OnDisconnected(stopCalled);
        }


        public static void DmNotificationFromSever(string userId, string message)
        {
            IHubContext hubContext = GlobalHost.ConnectionManager.GetHubContext<NotificationHub>();

            foreach (UserDetail user in ConnectedUsers)
            {
                if (user.UserId == userId)
                {
                    string conId = user.ConnectionId;
                    hubContext.Clients.Client(conId).dmNotificationFromSever(message);
                }
            }
        }



    }
}