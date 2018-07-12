﻿using System;
using System.Collections.Generic;
using System.Data.SqlTypes;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http.Controllers;
using System.Web.Http.Filters;
using YJY_COMMON.Encryption;
using YJY_COMMON.Model.Context;

namespace YJY_SVR.Controllers.Attributes
{
    public class TimestampNonceAuth : AuthorizationFilterAttribute
    {
        public override void OnAuthorization(HttpActionContext actionContext)
        {
            if (!actionContext.Request.Headers.Contains("signature"))
            {
                actionContext.Response = actionContext.Request.CreateResponse(HttpStatusCode.Unauthorized,
                    "signature required");
            }
            else
            {
                var des = new DESUtil();
                try
                {
                    string decrypted = des.Decrypt(actionContext.Request.Headers.GetValues("signature").First(),
                        DESUtil.SECRET_TIMESTAMP_NONCE_AUTH);
                    if (decrypted.Length < 11) //10位TimeStamp+Nonce
                    {
                        actionContext.Response = actionContext.Request.CreateResponse(HttpStatusCode.Unauthorized,
                            "invalid signature string");
                    }
                    else
                    {
                        long timeStamp = 0;
                        int nonce = 0;
                        long.TryParse(decrypted.Substring(0, 10), out timeStamp);
                        int.TryParse(decrypted.Substring(10), out nonce);
                        if (timeStamp == 0 || nonce == 0)
                        {
                            actionContext.Response =
                                actionContext.Request.CreateResponse(HttpStatusCode.Unauthorized,
                                    "invalid signature");
                        }
                        else
                        {
                            // Get the request lifetime scope so you can resolve services.
                            var requestScope = actionContext.Request.GetDependencyScope();

                            // Resolve the service you want to use.
                            var db = requestScope.GetService(typeof(YJYEntities)) as YJYEntities;

                            var record =
                                db.TimeStampNonces.FirstOrDefault(o => o.Nonce == nonce && o.TimeStamp == timeStamp);
                            if (record == null || record.UsedAt!=null)
                            {
                                actionContext.Response =
                                    actionContext.Request.CreateResponse(HttpStatusCode.Unauthorized,
                                        "signature unauthorized");
                            }
                            else
                            {
                                record.UsedAt = DateTime.UtcNow;
                                db.SaveChanges();
                            }
                        }
                    }
                }
                catch
                {
                    actionContext.Response = actionContext.Request.CreateResponse(HttpStatusCode.Unauthorized,
                        "signature checking failed");
                }
            }

            base.OnAuthorization(actionContext);
        }
    }
}