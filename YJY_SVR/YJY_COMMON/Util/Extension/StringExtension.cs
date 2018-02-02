﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace YJY_COMMON.Util.Extension
{
    public static class StringExtension
    {
        public static string TruncateMax(this string source, int length)
        {
            if (source == null)
            {
                return null;
            }
            if (source.Length > length)
            {
                return source.Substring(0, length);
            }
            return source;
        }
    }
}
