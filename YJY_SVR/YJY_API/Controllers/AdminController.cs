﻿using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using AutoMapper;
using YJY_API.Controllers;
using YJY_COMMON.Model.Context;
using YJY_COMMON.Service;
using YJY_API.DTO;
using YJY_API.Controllers.Attributes;
using YJY_COMMON.Model.Entity;
using System;

namespace YJY_API.Controllers
{
    [RoutePrefix("api/admin")]
    public class AdminController : YJYController
    {
        public AdminController(YJYEntities db, IMapper mapper) : base(db, mapper)
        {
        }

        [HttpPost]
        [Route("login")]
        public AdminUserDTO Login(AdminLoginFormDTO form)
        {
            if (string.IsNullOrWhiteSpace(form.email) || string.IsNullOrWhiteSpace(form.password))
                throw new HttpResponseException(Request.CreateErrorResponse(HttpStatusCode.BadRequest, "invalid request"));

            var user = db.AdminUsers.FirstOrDefault(o => o.Email == form.email && o.Password == form.password);

            if (user == null)
                return null;

            user.Token = UserService.NewToken();
            db.SaveChanges();

            return new AdminUserDTO()
            {
                id=user.Id,
                token = user.Token
            };
        }

        [HttpGet]
        [Route("deposit")]
        [AdminAuth]
        public object GetDepositList(string orderNum = null, int page = 1, int pageSize = 10, int? status = null)
        {
            var depositQuery = db.Deposits.AsQueryable();

            if(!string.IsNullOrEmpty(orderNum))
            {
                depositQuery = depositQuery.Where(d => d.OrderNum.Contains(orderNum));
            }

            if(status != null)
            {
                depositQuery = depositQuery.Where(d => d.Status == status.Value);
            }

            var result = (from d in depositQuery
                          join u in db.Users on d.UserId equals u.Id
                          select new
                          {
                              Deposit = d,
                              User = u
                          }).OrderByDescending(u=>u.Deposit.CreatedAt).Skip((page - 1) * pageSize).Take(pageSize).ToList();


            var data = result.Select(r => new {
                Id = r.Deposit.Id,
                Amount = r.Deposit.Amount,
                NickName = r.User.Nickname,
                Phone = r.User.Phone,
                CreatedAt = r.Deposit.CreatedAt.ToString("yyyy-MM-dd HH:mm:ss"),
                OrderNum = r.Deposit.OrderNum,
                ReceivedAmount = r.Deposit.ReceivedAmount,
                Status = r.Deposit.Status,
                StatusStr = getStatusStr(r.Deposit.Status),
            }).ToList();

            return data;
        }

        private string getStatusStr(int status)
        {
            string statusStr = "状态未知";

            switch(status)
            {
                case 0: statusStr = "未支付"; break;
                case 1: statusStr = "已支付未充值"; break;
                case 2: statusStr = "已充值"; break;
            }

            return statusStr;
        }

        [HttpPut]
        [Route("deposit")]
        [AdminAuth]
        public ResultDTO EditDeposit(Deposit deposit)
        {
            var depositEdit = db.Deposits.FirstOrDefault(d => d.Id == deposit.Id);
            if(depositEdit != null)
            {
                depositEdit.Status = deposit.Status;
                depositEdit.ReceivedAmount = deposit.ReceivedAmount;
                depositEdit.PayAt = DateTime.Now;
                db.SaveChanges();
            }

            ResultDTO dto = new ResultDTO();
            dto.success = true;

            return dto;
        }
    }
}