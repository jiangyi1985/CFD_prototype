﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace YJY_API.DTO.SignalRDTO
{
    public class QuoteFeed
    {
        public int id { get; set; }
        public decimal last { get; set; }

        //public decimal bid { get; set; }
        //public decimal ask { get; set; }

        public DateTime time { get; set; }
    }
}
