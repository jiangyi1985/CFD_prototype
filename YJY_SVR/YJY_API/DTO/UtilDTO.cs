﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Newtonsoft.Json.Linq;

namespace YJY_API.DTO
{
    public class ResultDTO
    {
        public ResultDTO(bool success)
        {
            this.success = success;
        }

        public ResultDTO()
        {
        }

        public bool success { get; set; }
        public string message { get; set; }
        public JToken error { get; set; }
    }

    public class TimeStampDTO
    {
        public long timeStamp;
        public int nonce;
        public string captchaImg { get; set; }
    }

    public class SendVerifyCodeFormDTO
    {
        public string phone { get; set; }
    }
}