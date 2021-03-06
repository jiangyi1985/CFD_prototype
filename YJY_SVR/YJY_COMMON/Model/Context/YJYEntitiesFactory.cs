﻿using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace YJY_COMMON.Model.Context
{
    public partial class YJYEntities
    {
        public YJYEntities(string connectionString)
            : base(connectionString)
        {
        }

        public static YJYEntities Create(bool log = false, bool UseDatabaseNullSemantics = true)
        {
            string connectionString = YJYGlobal.GetDbConnectionString("YJYEntities");
            var db = new YJYEntities(connectionString);

            db.Configuration.UseDatabaseNullSemantics = UseDatabaseNullSemantics;

            if (log || Debugger.IsAttached)
                db.Database.Log = s => Trace.WriteLine(s);

            //if (log)
            //    Global.LogLine("created object-context for main DB [" + db.Database.Connection.Database + "]");

            return db;
        }
    }
}
