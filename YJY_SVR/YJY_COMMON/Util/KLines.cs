﻿using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Globalization;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;
using YJY_COMMON.Model.Cache;

namespace YJY_COMMON.Util
{
    public class KLines
    {
        public static string GetKLineListNamePrefix(KLineSize kLineSize)
        {
            DescriptionAttribute attr = GetAttribute<DescriptionAttribute>(kLineSize);
            if (attr == null)
            {
                return string.Empty;
            }

            return attr.Description;
        }

        public static DateTime GetKLineTime(DateTime quoteTime, KLineSize klineSize, ProdDef prodDef=null)
        {
            if (klineSize == KLineSize.Day)
            {
                return Products.GetLocalDateRegardingSessionRefreshTime(quoteTime, prodDef);
            }

            PeriodAttribute attr = GetAttribute<PeriodAttribute>(klineSize);
            int period = attr.Period;
            return DateTimes.GetPeriodStartTime(quoteTime, period);
        }

        public static int GetClearWhenSize(KLineSize klineSize)
        {
            ClearWhenAttribute attr = GetAttribute<ClearWhenAttribute>(klineSize);
            return attr.Size;
        }

        public static int GetClearToSize(KLineSize klineSize)
        {
            ClearToAttribute attr = GetAttribute<ClearToAttribute>(klineSize);
            return attr.Size;
        }

        private static T GetAttribute<T>(KLineSize klineSize) where T : Attribute
        {
            var type = klineSize.GetType();
            FieldInfo field = type.GetField(Enum.GetName(type, klineSize));
            T attr = Attribute.GetCustomAttribute(field, typeof(T)) as T;

            return attr;
        }
    }

    public enum KLineSize
    {
        [Description("kline1m:")]
        [Period(1)]
        [ClearWhen(60 * 16)] //1分钟K线，需要显示4小时
        [ClearTo(60 * 8)]
        OneMinute,

        [Description("kline5m:")]
        [Period(5)]
        [ClearWhen(12 * 24 * 10)] //5分钟K线，需要显示2个交易日
        [ClearTo(12 * 24 * 5)]
        FiveMinutes,

        [Description("kline15m:")]
        [Period(15)]
        [ClearWhen(4 * 24 * 12)] //15分钟K线，需要显示3个交易日
        [ClearTo(4 * 24 * 6)]
        FifteenMinutes,

        [Description("kline60m:")]
        [Period(60)]
        [ClearWhen(1 * 24 * 48)] //60分钟K线，需要显示12个交易日
        [ClearTo(1 * 24 * 24)]
        SixtyMinutes,

        [Description("kline1d:")]
        [ClearWhen(22 * 12)] 
        [ClearTo(22 * 6)]
        Day
    }

    public class PeriodAttribute : Attribute
    {
        public int Period { get; }

        public PeriodAttribute(int period)
        {
            this.Period = period;
        }
    }

    public class ClearWhenAttribute : Attribute
    {
        public int Size { get; }

        public ClearWhenAttribute(int size)
        {
            this.Size = size;
        }
    }

    public class ClearToAttribute : Attribute
    {
        public int Size { get; }

        public ClearToAttribute(int size)
        {
            this.Size = size;
        }
    }
}
